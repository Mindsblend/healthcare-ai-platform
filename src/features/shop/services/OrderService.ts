import { prisma } from '@/lib/prisma'
import {
  OrderDetail,
  OrderSummary,
  ShippingInfo,
} from '@/components/types/types'
import { OrderStatus } from '@/components/types/types'

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

  // For single order with full details
  static async fetchOrderById(id: string): Promise<OrderDetail | null> {
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

  static async createOrder({
    userId,
    shippingInfo,
    paymentMethod,
  }: {
    userId: string
    shippingInfo: ShippingInfo
    paymentMethod: 'mellat' | 'zarinpal'
  }) {
    // Fetch active cart
    const cart = await prisma.cart.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { items: { include: { product: true } } },
    })

    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty or does not exist')
    }

    // Calculate total
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    )
    const TAX_RATE = 0.09
    const taxAmount = Math.round(subtotal * TAX_RATE)
    const totalPrice = subtotal + taxAmount

    // Transaction: create order + mark cart checked out + create order items
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          cartId: cart.id,
          totalPrice,
          status: 'PAID',
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

      // Mark cart as checked out
      await tx.cart.update({
        where: { id: cart.id },
        data: { status: 'CHECKED_OUT' },
      })

      return newOrder
    })

    return order
  }

  static async updateOrder(
    orderId: string,
    updates: {
      status?: OrderStatus
      shippingNotes?: string
    },
  ) {
    // Get current order to check status
    const currentOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!currentOrder) {
      throw new Error('Order not found')
    }

    // Update the order - only status and shippingNotes
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: updates.status,
        shippingNotes: updates.shippingNotes,
      },
    })

    return updatedOrder
  }
}
