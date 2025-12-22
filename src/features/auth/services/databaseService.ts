import { prisma } from '@/lib/prisma'

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
