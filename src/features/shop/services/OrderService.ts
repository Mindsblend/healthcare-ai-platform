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

    if (!userId || typeof userId !== 'string' || !userId.trim()) {
      throw new Error('Authenticated user is required')
    }

    // 1. Get active cart
    const cart = await prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty or does not exist')
    }

    for (const item of cart.items) {
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new Error('Cart contains an invalid item quantity')
      }

      if (!item.product || !item.product.isActive) {
        throw new Error('Cart contains an unavailable product')
      }

      const effectivePrice = item.product.discountedPrice ?? item.product.price

      if (!Number.isFinite(effectivePrice) || effectivePrice < 0) {
        throw new Error('Cart contains an invalid product price')
      }
    }

    // 2. Check for existing order with this cart
    const existingOrder = await prisma.order.findUnique({
      where: { cartId: cart.id },
    })

    // 3. Handle existing order based on status (Solare's approach)
    if (existingOrder) {
      // If already paid - throw error (can't pay again)
      if (existingOrder.status === 'PAID') {
        throw new Error('This cart has already been ordered and paid for.')
      }

      // If failed - delete and recreate (allow retry)
      if (existingOrder.status === 'FAILED') {
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
        return existingOrder
      }
      // If canceled - delete and recreate (allow retry)
      else if (existingOrder.status === 'CANCELED') {
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
    const subtotal = cart.items.reduce((sum, item) => {
      const effectivePrice = item.product.discountedPrice ?? item.product.price
      return sum + effectivePrice * item.quantity
    }, 0)
    const TAX_RATE = 0.09
    const taxAmount = Math.round(subtotal * TAX_RATE)

    const FREE_SHIPPING_THRESHOLD = 2_000_000
    const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
    const deliveryAmount = isFreeShipping ? 0 : 300_000
    const totalPrice = subtotal + taxAmount + deliveryAmount

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
              price: item.product.discountedPrice ?? item.product.price,
              originalPrice: item.product.price,
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

    try {
      const existingOrder = await prisma.order.findUnique({
        where: { id: orderId },
      })

      if (!existingOrder) {
        console.error('❌ [OrderService] Order not found:', orderId)
        throw new Error(`Order with ID ${orderId} not found`)
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentAuthority: authority,
          paymentRequestedAt: new Date(),
        },
      })

      return updatedOrder
    } catch (error: any) {
      throw error
    }
  }

  static async findOrderByAuthority(authority: string) {
    if (!authority) {
      return null
    }

    return prisma.order.findUnique({
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
  }

  static async verifyAndFinalizePayment(input: {
    authority: string
    refId: string
    status: 'PAID' | 'FAILED'
    errorMessage?: string
  }) {
    const { authority, refId, status, errorMessage } = input

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

        throw new Error('Order not found for authority: ' + authority)
      }

      if (order.status !== 'PENDING') {
        throw new Error(
          `Order ${order.id} is already finalized with status ${order.status}`,
        )
      }

      const updatedOrder = await prisma.$transaction(async (tx: any) => {
        const orderStatus: OrderStatus = status === 'PAID' ? 'PAID' : 'FAILED'

        const result = await tx.order.updateMany({
          where: {
            id: order.id,
            status: 'PENDING',
          },
          data: {
            status: orderStatus,
            paymentRefId: refId,
            paymentVerifiedAt: new Date(),
            paymentErrorMessage: errorMessage,
          },
        })

        if (result.count !== 1) {
          throw new Error(
            `Order ${order.id} is no longer pending and cannot be finalized`,
          )
        }

        if (status === 'PAID' && order.cartId) {
          await tx.cart.update({
            where: { id: order.cartId },
            data: { status: 'CHECKED_OUT' },
          })
        }

        return tx.order.findUnique({
          where: { id: order.id },
        })
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
