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
    email: user.email || null,
    phone: user.phone || null,
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

    if (typeof decoded === 'object' && typeof decoded.id === 'string') {
      return {
        id: decoded.id,
        email: typeof decoded.email === 'string' ? decoded.email : null,
        phone: typeof decoded.phone === 'string' ? decoded.phone : null,
      }
    }

    return null
  } catch (err: any) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return null
    }
    throw createDomainError(ErrorCode.INTERNAL_ERROR)
  }
}
