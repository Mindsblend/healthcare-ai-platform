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

    const existingOrder = await prisma.order.findUnique({
      where: { cartId: cart.id },
    })

    if (existingOrder) {
      console.log(
        `[OrderService] Found existing order: ${existingOrder.id}, status: ${existingOrder.status}`,
      )

      if (existingOrder.status === 'PAID') {
        throw new Error('This cart has already been ordered and paid for.')
      }

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
      }
      else if (existingOrder.status === 'PENDING') {
        console.log(
          `[OrderService] Returning existing PENDING order for payment continuation`,
        )
        return existingOrder
      }
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
      }
    }

    const subtotal = cart.items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    )
    const TAX_RATE = 0.09
    const taxAmount = Math.round(subtotal * TAX_RATE)
    const totalPrice = subtotal + taxAmount

    // تعریف status با تایپ OrderStatus
    const pendingStatus: OrderStatus = 'PENDING'

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          cartId: cart.id,
          totalPrice,
          status: pendingStatus, // استفاده از متغیر با تایپ مشخص
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
      // تعیین وضعیت با تایپ OrderStatus
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
        status: status as OrderStatus, // cast به OrderStatus
        shippingNotes,
      },
    })

    return updatedOrder
  }
}