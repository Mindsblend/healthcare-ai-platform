import { sign } from 'jsonwebtoken'
import { User } from '@prisma/client'
import { cookies } from 'next/headers'
import { SessionPayload } from '@/components/types/types'
import jwt, { JwtPayload } from 'jsonwebtoken'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = '7d' // adjust as needed

export function createJwtSession(user: User) {
  // Payload can include whatever you need for session
  const payload = {
    id: user.id,
    identifier: user.identifier,
  }

  const token = sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

  return token
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload

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
  } catch {
    return null
  }
}
