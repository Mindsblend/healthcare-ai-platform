import { verify, JwtPayload } from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export type EdgeSession = {
  id: string
  role: string
}

export function verifyToken(token: string): EdgeSession | null {
  try {
    const decoded = verify(token, JWT_SECRET) as JwtPayload

    if (
      typeof decoded === 'object' &&
      typeof decoded.id === 'string' &&
      typeof decoded.role === 'string'
    ) {
      return {
        id: decoded.id,
        role: decoded.role,
      }
    }

    return null
  } catch {
    return null
  }
}
