import { prisma } from '@/lib/prisma'
import { UserType } from '@/components/types/types'

export async function fetchAllUsers(): Promise<UserType[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true
    },
  })
}

export async function authorize(identifier: string, type: string) {
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
