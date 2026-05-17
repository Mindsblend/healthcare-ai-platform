import { verify, JwtPayload } from 'jsonwebtoken'
import { VerifyTokenInput, EdgeSession } from '../auth.types'

const JWT_SECRET = process.env.JWT_SECRET!

export function verifyToken(input: VerifyTokenInput): EdgeSession | null {
  const { token } = input

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
