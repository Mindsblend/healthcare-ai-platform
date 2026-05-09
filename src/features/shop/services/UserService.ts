import { UserInfo, UserOrder, UserSummary } from '@/components/types/types'
import { prisma } from '@/lib/prisma'

export async function fetchCurrentUser(
  userId: string,
): Promise<UserInfo | null> {
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

export async function fetchAllUsers(): Promise<UserSummary[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
    },
  })
}

export async function createUser(identifier: string, type: string) {
  let user
  if (type === 'phone') {
    user = await prisma.user.findUnique({ where: { phone: identifier } })
  } else {
    user = await prisma.user.findUnique({ where: { email: identifier } })
  }

  if (!user) {
    user = await prisma.user.create({ data: { [type]: identifier } })
  }

  return user
}

export async function fetchUserWithAddresses(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      addresses: {
        orderBy: { isDefault: 'desc' },
      },
    },
  })
}

export async function fetchUserWithOrders(
  userId: string,
): Promise<UserOrder | null> {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: true,
    },
  })
}

export async function saveAddress(userId: string, addressData: any) {
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

export async function updateAddress(
  addressId: string,
  userId: string,
  addressData: any,
) {
  return await prisma.address.update({
    where: { id: addressId, userId },
    data: addressData,
  })
}

export async function deleteAddress(addressId: string, userId: string) {
  return await prisma.address.delete({
    where: { id: addressId, userId },
  })
}

export async function setDefaultAddress(addressId: string, userId: string) {
  // Remove default from all user's addresses
  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  })

  // Set the selected address as default
  return await prisma.address.update({
    where: { id: addressId, userId },
    data: { isDefault: true },
  })
}

export async function updateUserProfile(
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
