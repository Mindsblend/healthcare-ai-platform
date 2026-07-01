// features/shop/orders/services/orderService.ts

import { prisma } from '@/lib/prisma'
import {
  OrderDetail,
  OrderSummary,
  CreateOrderInput,
  UpdateOrderInput,
  FetchOrderByIdInput,
  OrderStatus,
} from '../shop.types'

export class OrderService {
  static async fetchOrdersPreview(): Promise<OrderSummary[]> {
    return prisma.order.findMany({
      select: {
        id: true,
        totalPrice: true,
        shippingFirstName: true,
        shippingLastName: true,
        shippingPhone: true,
        createdAt: true,
        status: true,
      },
    })
  }

  static async fetchOrderById(
    input: FetchOrderByIdInput,
  ): Promise<OrderDetail | null> {
    const { id } = input
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                image: true,
                slug: true,
              },
            },
          },
        },
      },
    })

    return order as unknown as OrderDetail | null
  }

  static async createOrder(input: CreateOrderInput) {
    const { userId, shippingInfo, paymentMethod } = input

    // 1. Get active cart
    const cart = await prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty or does not exist')
    }

    // 2. Check for existing order with this cart
    const existingOrder = await prisma.order.findUnique({
      where: { cartId: cart.id },
    })

    // 3. Handle existing order based on status (Solare's approach)
    if (existingOrder) {
      console.log(
        `[OrderService] Found existing order: ${existingOrder.id}, status: ${existingOrder.status}`,
      )

      // If already paid - throw error (can't pay again)
      if (existingOrder.status === 'PAID') {
        throw new Error('This cart has already been ordered and paid for.')
      }

      // If failed - delete and recreate (allow retry)
      if (existingOrder.status === 'FAILED') {
        console.log(`[OrderService] Deleting failed order, allowing retry...`)

        await prisma.$transaction(async (tx: any) => {
          await tx.orderItem.deleteMany({
            where: { orderId: existingOrder.id },
          })
          await tx.order.delete({
            where: { id: existingOrder.id },
          })
        })

        // Continue to create new order below
      }
      // If pending - return it (reuse for payment continuation)
      else if (existingOrder.status === 'PENDING') {
        console.log(
          `[OrderService] Returning existing PENDING order for payment continuation`,
        )
        return existingOrder
      }
      // If canceled - delete and recreate (allow retry)
      else if (existingOrder.status === 'CANCELED') {
        console.log(`[OrderService] Deleting canceled order, allowing retry...`)

        await prisma.$transaction(async (tx: any) => {
          await tx.orderItem.deleteMany({
            where: { orderId: existingOrder.id },
          })
          await tx.order.delete({
            where: { id: existingOrder.id },
          })
        })

        // Continue to create new order below
      }
    }

    // 4. Calculate totals (only if no PENDING order exists)
    const subtotal = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    )
    const TAX_RATE = 0.09
    const taxAmount = Math.round(subtotal * TAX_RATE)

    const FREE_SHIPPING_THRESHOLD = 2_000_000
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
    const deliveryAmount = isFreeShipping ? 0 : 300_000
    const totalPrice = subtotal + taxAmount + deliveryAmount

    console.log('📝 [OrderService] Calculated total:', {
      subtotal,
      taxAmount,
      deliveryAmount,
      totalPrice,
    })

    const pendingStatus: OrderStatus = 'PENDING'

    // 5. Create new order
    const order = await prisma.$transaction(async (tx: any) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          cartId: cart.id,
          totalPrice,
          status: pendingStatus,
          paymentMethod,
          shippingFirstName: shippingInfo.firstName,
          shippingLastName: shippingInfo.lastName,
          shippingEmail: shippingInfo.email,
          shippingPhone: shippingInfo.phone,
          shippingCity: shippingInfo.city,
          shippingProvince: shippingInfo.province,
          shippingAddress: shippingInfo.address,
          shippingPostalCode: shippingInfo.postalCode,
          shippingNotes: shippingInfo.notes || '',
          items: {
            create: cart.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      })

      return newOrder
    })

    return order
  }

  static async updateOrderPaymentAuthority(input: {
    orderId: string
    authority: string
  }) {
    const { orderId, authority } = input

    console.log('📝 [OrderService] updateOrderPaymentAuthority called:', {
      orderId,
      authority: authority?.substring(0, 8) + '...',
      authorityType: typeof authority,
      authorityLength: authority?.length,
    })

    try {
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      })

      if (!existingOrder) {
        console.error('❌ [OrderService] Order not found:', orderId)
        throw new Error(`Order with ID ${orderId} not found`)
      }

      console.log(
        '📝 [OrderService] Current order status:',
        existingOrder.status,
      )

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentAuthority: authority,
          paymentRequestedAt: new Date(),
        },
      })

      console.log('✅ [OrderService] Authority updated successfully:', {
        orderId: updatedOrder.id,
        authority: updatedOrder.paymentAuthority?.substring(0, 8) + '...',
        status: updatedOrder.status,
      })

      return updatedOrder
    } catch (error: any) {
      console.error(
        '❌ [OrderService] Failed to update authority:',
        error.message,
      )
      throw error
    }
  }

  static async findOrderByAuthority(authority: string) {
    console.log('🔍 [OrderService] findOrderByAuthority called:', {
      authority: authority?.substring(0, 8) + '...',
      authorityType: typeof authority,
      authorityLength: authority?.length,
    })

    if (!authority) {
      console.error('❌ [OrderService] Authority is empty or null')
      return null
    }

    try {
      let order = await prisma.order.findFirst({
        where: {
          paymentAuthority: authority,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })

      if (!order) {
        console.log('🔍 [OrderService] Trying contains search...')
        order = await prisma.order.findFirst({
          where: {
            paymentAuthority: {
              contains: authority,
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        })
      }

      if (!order) {
        console.log('🔍 [OrderService] Trying startsWith search...')
        const first20Chars = authority.substring(0, 20)
        order = await prisma.order.findFirst({
          where: {
            paymentAuthority: {
              startsWith: first20Chars,
            },
          },
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        })
      }

      if (order) {
        console.log('✅ [OrderService] Order found:', {
          id: order.id,
          authority: order.paymentAuthority?.substring(0, 8) + '...',
          status: order.status,
        })
      } else {
        console.log(
          '❌ [OrderService] No order found with authority:',
          authority?.substring(0, 8) + '...',
        )

        const allOrders = await prisma.order.findMany({
          select: {
            id: true,
            paymentAuthority: true,
            status: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        })

        console.log(
          '📝 [OrderService] Recent orders:',
          JSON.stringify(allOrders, null, 2),
        )
      }

      return order
    } catch (error: any) {
      console.error('❌ [OrderService] Error finding order:', error.message)
      throw error
    }
  }

  static async verifyAndFinalizePayment(input: {
    authority: string
    refId: string
    status: 'PAID' | 'FAILED'
    errorMessage?: string
  }) {
    const { authority, refId, status, errorMessage } = input

    console.log('📝 [OrderService] verifyAndFinalizePayment called:', {
      authority: authority?.substring(0, 8) + '...',
      refId,
      status,
      errorMessage,
    })

    try {
      const order = await prisma.order.findFirst({
        where: { paymentAuthority: authority },
        include: { cart: true },
      })

      if (!order) {
        console.error(
          '❌ [OrderService] Order not found for authority:',
          authority?.substring(0, 8) + '...',
        )

        const allOrders = await prisma.order.findMany({
          select: {
            id: true,
            paymentAuthority: true,
            status: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        })

        console.log(
          '📝 [OrderService] Recent orders:',
          JSON.stringify(allOrders, null, 2),
        )

        throw new Error('Order not found for authority: ' + authority)
      }

      console.log('✅ [OrderService] Order found:', {
        id: order.id,
        authority: order.paymentAuthority?.substring(0, 8) + '...',
        status: order.status,
      })

      const updatedOrder = await prisma.$transaction(async (tx: any) => {
        const orderStatus: OrderStatus = status === 'PAID' ? 'PAID' : 'FAILED'

        const updated = await tx.order.update({
          where: { id: order.id },
          data: {
            status: orderStatus,
            paymentRefId: refId,
            paymentVerifiedAt: new Date(),
            paymentErrorMessage: errorMessage,
          },
        })

        // ✅ Only mark cart as CHECKED_OUT if payment succeeded
        if (status === 'PAID' && order.cartId) {
          await tx.cart.update({
            where: { id: order.cartId },
            data: { status: 'CHECKED_OUT' },
          })
        }

        return updated
      })

      console.log('✅ [OrderService] Order updated successfully:', {
        id: updatedOrder.id,
        status: updatedOrder.status,
        refId: updatedOrder.paymentRefId,
      })

      return updatedOrder
    } catch (error: any) {
      console.error(
        '❌ [OrderService] Failed to verify payment:',
        error.message,
      )
      throw error
    }
  }

  static async updateOrder(input: UpdateOrderInput) {
    const { orderId, status, shippingNotes } = input

    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!currentOrder) {
      throw new Error('Order not found')
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status as OrderStatus,
        shippingNotes,
      },
    })

    return updatedOrder
  }
}
