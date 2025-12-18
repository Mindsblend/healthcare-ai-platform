import { sign, verify, JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { User } from '@prisma/client'
import { SessionPayload } from '@/components/types/types'
import { createDomainError, ErrorCode } from '@/lib/errors'

if (!process.env.JWT_SECRET) {
  throw createDomainError(ErrorCode.INTERNAL_ERROR)
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '7d'

export function createJwtSession(user: User): string {
  const payload = {
    id: user.id,
    identifier: user.identifier,
  }

  try {
    return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
  } catch {
    throw createDomainError(ErrorCode.INTERNAL_ERROR)
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null

  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload

    if (
      typeof decoded === 'object' &&
      typeof decoded.id === 'string' &&
      typeof decoded.identifier === 'string'
    ) {
      return {
        id: decoded.id,
        identifier: decoded.identifier,
      }
    }

    return null
  } catch (err: any) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return null // token expired or invalid = unauthenticated
    }
    // Real server error
    throw createDomainError(ErrorCode.INTERNAL_ERROR)
  }
}
