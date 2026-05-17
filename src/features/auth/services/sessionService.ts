import { sign, verify, JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { User } from '@prisma/client'
import { SessionPayload } from '@/components/types/types'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { NextRequest } from 'next/server'

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw createDomainError(
      ErrorCode.INTERNAL_ERROR,
      'JWT_SECRET not configured',
    )
  }
  return secret
}

const JWT_EXPIRES_IN = '7d'
const COOKIE_NAME = 'session'

// const COOKIE_OPTIONS = {
//   httpOnly: false,
//   secure: false, // PRODUCTION TODO: Set to true in production for secure cookie passing
//   sameSite: 'lax' as const,
//   path: '/',
//   maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
//   priority: 'high' as const,
// }

// sessionService.ts - temporary simplified cookie options for debugging
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // ✅ Set to false for local development
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
  // priority: 'high' as const, // ✅ Comment this out temporarily - some browsers have issues
}

export function createJwtSession(user: User): string {
  const payload = {
    id: user.id,
    email: user.email || null,
    phone: user.phone || null,
    role: user.role,
  }

  try {
    return sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN })
  } catch {
    throw createDomainError(
      ErrorCode.INTERNAL_ERROR,
      'Failed to create session',
    )
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, COOKIE_OPTIONS)
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    const decoded = verify(token, getJwtSecret()) as JwtPayload

    // Validate required fields
    if (!decoded || typeof decoded !== 'object') {
      await clearSessionCookie() // Clear invalid cookie
      return null
    }

    // Check for required id field
    const id = decoded.id
    if (!id || typeof id !== 'string') {
      await clearSessionCookie() // Clear invalid cookie
      return null
    }

    // Check expiration (additional safety beyond JWT verification)
    const exp = decoded.exp
    if (exp && exp * 1000 < Date.now()) {
      await clearSessionCookie() // Clear expired cookie
      return null
    }

    return {
      id: decoded.id,
      email: typeof decoded.email === 'string' ? decoded.email : null,
      phone: typeof decoded.phone === 'string' ? decoded.phone : null,
      role: typeof decoded.role === 'string' ? decoded.role : 'USER',
    }
  } catch (err: any) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      console.log('Session token expired, clearing cookie')
      await clearSessionCookie()
      return null
    }

    if (err.name === 'JsonWebTokenError') {
      console.log('Invalid session token, clearing cookie')
      await clearSessionCookie()
      return null
    }

    // Unexpected error
    console.error('Session verification error:', err)
    throw createDomainError(
      ErrorCode.INTERNAL_ERROR,
      'Session verification failed',
    )
  }
}

export function getSessionFromRequest(req: NextRequest): SessionPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value

  if (!token) return null

  try {
    const decoded = verify(token, getJwtSecret()) as JwtPayload

    if (!decoded || typeof decoded !== 'object') {
      return null
    }

    const id = decoded.id
    if (!id || typeof id !== 'string') {
      return null
    }

    // Check expiration
    const exp = decoded.exp
    if (exp && exp * 1000 < Date.now()) {
      return null
    }

    return {
      id: decoded.id,
      email: typeof decoded.email === 'string' ? decoded.email : null,
      phone: typeof decoded.phone === 'string' ? decoded.phone : null,
      role: typeof decoded.role === 'string' ? decoded.role : 'USER',
    }
  } catch (err: any) {
    if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
      return null
    }
    // In middleware, we can't throw - just return null
    console.error('Middleware session error:', err.message)
    return null
  }
}

export async function requireAuthority(
  requiredRole: 'ADMIN' | 'USER',
): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) {
    throw createDomainError(ErrorCode.UNAUTHORIZED)
  }

  // ADMIN can access USER endpoints
  if (session.role === 'ADMIN' && requiredRole === 'USER') {
    return session
  }

  // For all other cases, exact role match required
  if (session.role !== requiredRole) {
    throw createDomainError(ErrorCode.UNAUTHORIZED)
  }

  return session
}

export async function refreshSessionIfNeeded(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return

  try {
    const decoded = verify(token, getJwtSecret()) as JwtPayload

    // Refresh if less than 1 day remaining
    const exp = decoded.exp
    if (
      exp &&
      exp * 1000 - Date.now() < 24 * 60 * 60 * 1000 &&
      exp * 1000 > Date.now()
    ) {
      const newToken = sign(
        {
          id: decoded.id,
          email: decoded.email,
          phone: decoded.phone,
          role: decoded.role,
        },
        getJwtSecret(),
        { expiresIn: JWT_EXPIRES_IN },
      )

      await setSessionCookie(newToken)
    }
  } catch (error) {
    console.error('Session refresh failed:', error)
  }
}
