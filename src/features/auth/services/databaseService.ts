import { prisma } from '@/lib/prisma'
import { UserSummary } from '@/components/types/types'

export async function fetchAllUsers(): Promise<UserSummary[]> {
  return prisma.user.findMany({
    select: {
      id: true,
      email: true,
      phone: true,
    },
  })
}

// export async function getCurrentUser(userId: string) {
//   return await prisma.user.findUnique({
//     where: { id: userId },
//     select: {
//       id: true,
//       firstName: true,
//       lastName: true,
//       email: true,
//       phone: true,
//       postalCode: true,
//       address: true,
//       // any other profile fields you need
//     },
//   })
// }

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
