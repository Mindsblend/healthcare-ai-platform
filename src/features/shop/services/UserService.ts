import { prisma } from '@/lib/prisma'
import { UserInfo, UserOrder, UserSummary } from '../shop.types'

export class UserService {
  static async fetchCurrentUser(userId: string): Promise<UserInfo | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    })
  }

  static async fetchAllUsers(): Promise<UserSummary[]> {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        phone: true,
      },
    })
  }

  static async createUser(identifier: string, type: string) {
    if (type === 'phone') {
      return prisma.user.upsert({
        where: { phone: identifier },
        update: {},
        create: { phone: identifier },
      })
    }

    if (type === 'email') {
      return prisma.user.upsert({
        where: { email: identifier },
        update: {},
        create: { email: identifier },
      })
    }

    throw new Error(`Unsupported identifier type: ${type}`)
  }

  static async fetchUserWithAddresses(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          orderBy: { isDefault: 'desc' },
        },
      },
    })
  }

  static async fetchUserWithOrders(userId: string): Promise<UserOrder | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        orders: {
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
  }

  static async createAddress(userId: string, addressData: any) {
    // Check if this is the first address
    const addressCount = await prisma.address.count({ where: { userId } })
    const isFirstAddress = addressCount === 0

    return await prisma.address.create({
      data: {
        ...addressData,
        userId,
        isDefault: isFirstAddress ? true : addressData.isDefault || false,
      },
    })
  }

  static async updateAddress(
    addressId: string,
    userId: string,
    addressData: any,
  ) {
    return await prisma.address.update({
      where: { id: addressId, userId },
      data: addressData,
    })
  }

  static async deleteAddress(addressId: string, userId: string) {
    return await prisma.address.delete({
      where: { id: addressId, userId },
    })
  }

  static async setDefaultAddress(addressId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const address = await tx.address.update({
        where: { id: addressId, userId },
        data: { isDefault: true },
      })

      await tx.address.updateMany({
        where: {
          userId,
          id: { not: addressId },
        },
        data: { isDefault: false },
      })

      return address
    })
  }

  static async fetchUserTotalSavings(userId: string): Promise<number> {
    const orderItems = await prisma.orderItem.findMany({
      where: {
        originalPrice: { not: null },
        order: {
          userId,
          status: {
            in: ['PAID', 'DELIVERED'],
          },
        },
      },
      select: {
        originalPrice: true,
        price: true,
        quantity: true,
      },
    })

    console.log(
      '[Savings Debug]',
      orderItems.map((item) => ({
        originalPrice: item.originalPrice,
        price: item.price,
        quantity: item.quantity,
      })),
    )

    return orderItems.reduce((total, item) => {
      if (item.originalPrice === null) return total

      const savingPerItem = Math.max(0, item.originalPrice - item.price)

      return total + savingPerItem * item.quantity
    }, 0)
  }

  static async updateUserProfile(
    userId: string,
    data: {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
    },
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data,
    })
  }
}
