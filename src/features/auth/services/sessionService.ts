// features/auth/services/sessionService.ts

import { sign, verify, JwtPayload } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { User } from '@prisma/client'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { NextRequest } from 'next/server'
import {
  SessionPayload,
  JwtPayload as JwtPayloadType,
  CookieOptions,
  CreateSessionInput,
  RequireAuthorityInput,
} from '../auth.types'

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

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
  path: '/',
  maxAge: 60 * 60 * 24 * 7,
}

export function createJwtSession(user: User): string {
  const payload: CreateSessionInput = {
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
    const decoded = verify(token, getJwtSecret()) as JwtPayloadType

    if (!decoded || typeof decoded !== 'object') {
      await clearSessionCookie()
      return null
    }

    const id = decoded.id
    if (!id || typeof id !== 'string') {
      await clearSessionCookie()
      return null
    }

    const exp = decoded.exp
    if (exp && exp * 1000 < Date.now()) {
      await clearSessionCookie()
      return null
    }

    return {
      id: decoded.id,
      email: typeof decoded.email === 'string' ? decoded.email : null,
      phone: typeof decoded.phone === 'string' ? decoded.phone : null,
      role: typeof decoded.role === 'string' ? decoded.role : 'USER',
    }
  } catch (err: any) {
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
    const decoded = verify(token, getJwtSecret()) as JwtPayloadType

    if (!decoded || typeof decoded !== 'object') {
      return null
    }

    const id = decoded.id
    if (!id || typeof id !== 'string') {
      return null
    }

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
    console.error('Middleware session error:', err.message)
    return null
  }
}

export async function requireAuthority(
  input: RequireAuthorityInput,
): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) {
    throw createDomainError(ErrorCode.UNAUTHORIZED)
  }

  const { requiredRole } = input

  if (session.role === 'ADMIN' && requiredRole === 'USER') {
    return session
  }

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
    const decoded = verify(token, getJwtSecret()) as JwtPayloadType

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
