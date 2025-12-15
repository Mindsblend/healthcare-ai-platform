import { prisma } from '@/lib/prisma'

export async function authorize(identifier: string) {
  let user = await prisma.user.findUnique({ where: { identifier } })
  if (!user) {
    user = await prisma.user.create({ data: { identifier } })
  }
  return user
}
