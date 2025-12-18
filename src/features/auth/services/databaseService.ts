import { prisma } from '@/lib/prisma'
import { createDomainError, ErrorCode } from '@/lib/errors'

export async function authorize(identifier: string) {
  if (!identifier) createDomainError(ErrorCode.MISSING_PHONE_NUMBER)

  try {
    let user = await prisma.user.findUnique({ where: { identifier } })
    if (!user) {
      user = await prisma.user.create({ data: { identifier } })
    }
    return user
  } catch (err) {
    console.error('DB error in authorize:', err)
    throw createDomainError(ErrorCode.INTERNAL_ERROR)
  }
}
