// features/shop/orders/services/orderService.ts

import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
import {
  OrderDetail,
  OrderSummary,
  CreateOrderInput,
  UpdateOrderInput,
  FetchOrderByIdInput,
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
    return prisma.order.findUnique({
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
  }

  static async createOrder(input: CreateOrderInput) {
    const { userId, shippingInfo, paymentMethod } = input

    const cart = await prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty or does not exist')
    }

    // Check if order already exists for this cart
    const existingOrder = await prisma.order.findUnique({
      where: { cartId: cart.id },
    })

    // If order exists
    if (existingOrder) {
      console.log(
        `[OrderService] Found existing order: ${existingOrder.id}, status: ${existingOrder.status}`,
      )

      // Case 1: Order is PAID - cannot create new order
      if (existingOrder.status === 'PAID') {
        throw new Error('This cart has already been ordered and paid for.')
      }

      // Case 2: Order is FAILED - delete it and create new one (user can retry)
      if (existingOrder.status === 'FAILED') {
        console.log(`[OrderService] Deleting failed order, allowing retry...`)

        await prisma.$transaction(async (tx) => {
          await tx.orderItem.deleteMany({
            where: { orderId: existingOrder.id },
          })
          await tx.order.delete({
            where: { id: existingOrder.id },
          })
        })
        // Continue to create new order below
      }

      // Case 3: Order is PENDING - return existing order (user continues payment)
      else if (existingOrder.status === 'PENDING') {
        console.log(
          `[OrderService] Returning existing PENDING order for payment continuation`,
        )
        return existingOrder
      }

      // Case 4: Order is CANCELED - delete and create new
      else if (existingOrder.status === 'CANCELED') {
        console.log(`[OrderService] Deleting canceled order, allowing retry...`)

        await prisma.$transaction(async (tx) => {
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

    // If we reach here, either no order exists or we deleted a FAILED/CANCELED one
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    const TAX_RATE = 0.09
    const taxAmount = Math.round(subtotal * TAX_RATE)
    const totalPrice = subtotal + taxAmount

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          cartId: cart.id,
          totalPrice,
          status: OrderStatus.PENDING,
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
            create: cart.items.map((item) => ({
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

    return prisma.order.update({
      where: { id: orderId },
      data: {
        paymentAuthority: authority,
        paymentRequestedAt: new Date(),
      },
    })
  }

  static async findOrderByAuthority(authority: string) {
    return prisma.order.findFirst({
      where: { paymentAuthority: authority },
    })
  }

  // Payment successful: PENDING → PAID
  static async verifyAndFinalizePayment(input: {
    authority: string
    refId: string
    status: 'PAID' | 'FAILED'
    errorMessage?: string
  }) {
    const { authority, refId, status, errorMessage } = input

    const order = await prisma.order.findFirst({
      where: { paymentAuthority: authority },
      include: { cart: true },
    })

    if (!order) {
      throw new Error('Order not found for authority: ' + authority)
    }

    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: order.id },
        data: {
          status: status === 'PAID' ? OrderStatus.PAID : OrderStatus.FAILED,
          paymentRefId: refId,
          paymentVerifiedAt: new Date(),
          paymentErrorMessage: errorMessage,
        },
      })

      // Only clear cart if payment was successful
      if (status === 'PAID' && order.cartId) {
        await tx.cart.update({
          where: { id: order.cartId },
          data: { status: 'CHECKED_OUT' },
        })
      }

      return updated
    })

    return updatedOrder
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
        status,
        shippingNotes,
      },
    })

    return updatedOrder
  }
}
