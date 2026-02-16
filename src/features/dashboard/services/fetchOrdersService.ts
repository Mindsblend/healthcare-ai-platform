import { prisma } from '@/lib/prisma'
import { OrderType } from '@/components/types/types'

export async function fetchAllOrders(): Promise<OrderType[]> {
  return prisma.order.findMany({
    select: {
      id: true,
      user: true,
      cart: true,
      totalPrice: true,
    },
  })
}

export async function fetchOrderBySlug(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      cart: true,
    },
  })

  return order
}
