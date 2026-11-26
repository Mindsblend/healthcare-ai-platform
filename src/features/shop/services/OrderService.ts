// features/shop/orders/services/orderService.ts

import { prisma } from '@/lib/prisma'
import type { Prisma } from '@/generated/prisma/client'
import { enqueueOrderStatusNotification } from '@/features/notifications/services/notificationOutbox'
import { dispatchNotification } from '@/features/notifications/services/notificationDispatcher'
import {
  OrderDetail,
  OrderSummary,
  CreateOrderInput,
  UpdateOrderInput,
  FetchOrderByIdInput,
  OrderStatus,
} from '../shop.types'

export class OrderService {
  /**
   * تنها مسیر تغییر وضعیت سفارش.
   *
   * تغییر وضعیت و ثبت اعلان در Outbox داخل یک تراکنش انجام می‌شود؛ ارسال
   * Push بعد از commit و به‌صورت fire-and-forget است تا خطای ارسال هرگز
   * باعث rollback سفارش نشود.
   */
  private static async applyStatusTransition(input: {
    orderId: string
    status?: OrderStatus
    data?: Prisma.OrderUpdateInput
    expectedStatus?: OrderStatus
    checkoutCart?: boolean
  }) {
    const { orderId, status, data = {}, expectedStatus, checkoutCart } = input

    const notificationId = await prisma.$transaction(async (tx) => {
      const existing = await tx.order.findUnique({
        where: { id: orderId },
        select: {
          id: true,
          userId: true,
          cartId: true,
          status: true,
        },
      })

      if (!existing) {
        throw new Error('Order not found')
      }

      const statusChanged = Boolean(status && status !== existing.status)

      if (expectedStatus) {
        const result = await tx.order.updateMany({
          where: { id: orderId, status: expectedStatus },
          data: {
            ...data,
            ...(status ? { status } : {}),
          },
        })

        if (result.count !== 1) {
          throw new Error(
            `Order ${orderId} is no longer ${expectedStatus} and cannot be finalized`,
          )
        }
      } else {
        await tx.order.update({
          where: { id: orderId },
          data: {
            ...data,
            ...(status ? { status } : {}),
          },
        })
      }

      if (checkoutCart && existing.cartId) {
        await tx.cart.update({
          where: { id: existing.cartId },
          data: { status: 'CHECKED_OUT' },
        })
      }

      if (!statusChanged || !status || !existing.userId) {
        return null
      }

      return enqueueOrderStatusNotification(tx, {
        orderId,
        userId: existing.userId,
        status,
      })
    })

    if (notificationId) {
      void dispatchNotification(notificationId).catch((error) => {
        console.error(
          '[order-status] notification dispatch failed',
          notificationId,
          error,
        )
      })
    }

    return prisma.order.findUniqueOrThrow({ where: { id: orderId } })
  }

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

  static async getOrderForPayment(input: {
    orderId: string
    userId: string
  }): Promise<OrderDetail | null> {
    const { orderId, userId } = input
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
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

    // 3. Block only if the order is already paid or in post-payment processing
    if (existingOrder) {
      const retryableStatuses: OrderStatus[] = ['PENDING', 'FAILED', 'CANCELED']
      if (!retryableStatuses.includes(existingOrder.status as OrderStatus)) {
        throw new Error('This cart has already been ordered and paid for.')
      }
    }

    // 4. Always calculate fresh totals from current active cart items
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

    // 5. Delete stale order (PENDING / FAILED / CANCELED) and create fresh order atomically
    const order = await prisma.$transaction(async (tx: any) => {
      if (existingOrder) {
        await tx.orderItem.deleteMany({
          where: { orderId: existingOrder.id },
        })
        await tx.order.delete({
          where: { id: existingOrder.id },
        })
      }

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

      const orderStatus: OrderStatus = status === 'PAID' ? 'PAID' : 'FAILED'

      const updatedOrder = await this.applyStatusTransition({
        orderId: order.id,
        status: orderStatus,
        expectedStatus: 'PENDING',
        checkoutCart: status === 'PAID',
        data: {
          paymentRefId: refId,
          paymentVerifiedAt: new Date(),
          paymentErrorMessage: errorMessage,
        },
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

  /**
   * نهایی‌سازی پرداخت بر اساس شناسه سفارش (مسیر callback درگاه).
   */
  static async finalizePayment(input: {
    orderId: string
    status: 'PAID' | 'FAILED'
    refId?: string
    errorMessage?: string
  }) {
    const { orderId, status, refId, errorMessage } = input

    if (status === 'PAID') {
      return this.applyStatusTransition({
        orderId,
        status: 'PAID',
        expectedStatus: 'PENDING',
        checkoutCart: true,
        data: {
          paymentRefId: refId ?? '',
          paymentVerifiedAt: new Date(),
        },
      })
    }

    return this.applyStatusTransition({
      orderId,
      status: 'FAILED',
      expectedStatus: 'PENDING',
      data: {
        paymentErrorMessage: errorMessage,
      },
    })
  }

  static async updateOrder(input: UpdateOrderInput) {
    const { orderId, status, shippingNotes } = input

    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!currentOrder) {
      throw new Error('Order not found')
    }

    const updatedOrder = await this.applyStatusTransition({
      orderId,
      status,
      data: {
        shippingNotes,
      },
    })

    return updatedOrder
  }
}
