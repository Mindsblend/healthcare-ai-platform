import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  createJwtSession,
  setSessionCookie,
  clearSessionCookie,
  getSession,
  getSessionFromRequest,
  requireAuthority,
  refreshSessionIfNeeded,
} from '@/features/auth/services/sessionService'

import { ErrorCode } from '@/lib/errors'

const { signMock, verifyMock, cookieStore } = vi.hoisted(() => ({
  signMock: vi.fn(),
  verifyMock: vi.fn(),
  cookieStore: {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  },
}))

vi.mock('jsonwebtoken', () => ({
  sign: signMock,
  verify: verifyMock,
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => cookieStore),
}))

describe('sessionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    process.env.JWT_SECRET = 'test-secret'
  })

  describe('createJwtSession', () => {
    it('creates a JWT containing the user session payload', () => {
      signMock.mockReturnValue('jwt-token')

      const result = createJwtSession({
        id: 'user-1',
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
      })

      expect(result).toBe('jwt-token')

      expect(signMock).toHaveBeenCalledWith(
        {
          id: 'user-1',
          email: 'user@example.com',
          phone: '+123456789',
          role: 'USER',
        },
        'test-secret',
        {
          expiresIn: '7d',
        },
      )
    })

    it('throws INTERNAL_ERROR when JWT_SECRET is not configured', () => {
      delete process.env.JWT_SECRET

      expect(() =>
        createJwtSession({
          id: 'user-1',
          email: 'user@example.com',
          phone: '+123456789',
          role: 'USER',
        }),
      ).toThrow(
        expect.objectContaining({
          code: ErrorCode.INTERNAL_ERROR.code,
        }),
      )

      expect(signMock).not.toHaveBeenCalled()
    })

    it('throws INTERNAL_ERROR when JWT signing fails', () => {
      signMock.mockImplementation(() => {
        throw new Error('JWT signing failed')
      })

      expect(() =>
        createJwtSession({
          id: 'user-1',
          email: 'user@example.com',
          phone: '+123456789',
          role: 'USER',
        }),
      ).toThrow(
        expect.objectContaining({
          code: ErrorCode.INTERNAL_ERROR.code,
        }),
      )
    })
  })

  describe('setSessionCookie', () => {
    it('sets a secure cookie in production', async () => {
      vi.stubEnv('NODE_ENV', 'production')
      vi.resetModules()

      const { setSessionCookie } =
        await import('@/features/auth/services/sessionService')

      await setSessionCookie('jwt-token')

      expect(cookieStore.set).toHaveBeenCalledWith(
        'session',
        'jwt-token',
        expect.objectContaining({
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        }),
      )
    })

    it('clears the session cookie', async () => {
      await clearSessionCookie()

      expect(cookieStore.delete).toHaveBeenCalledWith('session')
    })
  })

  describe('getSession', () => {
    it('returns null when no session cookie exists', async () => {
      cookieStore.get.mockReturnValue(undefined)

      const result = await getSession()

      expect(result).toBeNull()
      expect(verifyMock).not.toHaveBeenCalled()
    })

    it('returns the session payload from a valid token', async () => {
      cookieStore.get.mockReturnValue({
        value: 'jwt-token',
      })

      verifyMock.mockReturnValue({
        id: 'user-1',
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
        exp: Math.floor(Date.now() / 1000) + 3600,
      })

      const result = await getSession()

      expect(result).toEqual({
        id: 'user-1',
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
      })

      expect(verifyMock).toHaveBeenCalledWith('jwt-token', 'test-secret')
    })

    it('clears the cookie and returns null when the token is expired', async () => {
      cookieStore.get.mockReturnValue({
        value: 'expired-token',
      })

      verifyMock.mockImplementation(() => {
        const error = new Error('jwt expired')
        error.name = 'TokenExpiredError'
        throw error
      })

      const result = await getSession()

      expect(result).toBeNull()

      expect(cookieStore.delete).toHaveBeenCalledWith('session')
    })

    it('clears the cookie and returns null when the token is invalid', async () => {
      cookieStore.get.mockReturnValue({
        value: 'invalid-token',
      })

      verifyMock.mockImplementation(() => {
        const error = new Error('invalid token')
        error.name = 'JsonWebTokenError'
        throw error
      })

      const result = await getSession()

      expect(result).toBeNull()

      expect(cookieStore.delete).toHaveBeenCalledWith('session')
    })

    it('clears the cookie and returns null when the decoded token is not an object', async () => {
      cookieStore.get.mockReturnValue({
        value: 'malformed-token',
      })

      verifyMock.mockReturnValue(null)

      const result = await getSession()

      expect(result).toBeNull()

      expect(cookieStore.delete).toHaveBeenCalledWith('session')
    })

    it('clears the cookie and returns null when the session id is missing', async () => {
      cookieStore.get.mockReturnValue({
        value: 'token-without-id',
      })

      verifyMock.mockReturnValue({
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
      })

      const result = await getSession()

      expect(result).toBeNull()

      expect(cookieStore.delete).toHaveBeenCalledWith('session')
    })

    it('clears the cookie and returns null when the session id is not a string', async () => {
      cookieStore.get.mockReturnValue({
        value: 'token-with-invalid-id',
      })

      verifyMock.mockReturnValue({
        id: 123,
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
      })

      const result = await getSession()

      expect(result).toBeNull()

      expect(cookieStore.delete).toHaveBeenCalledWith('session')
    })

    it('clears the cookie and returns null when the token expiration timestamp has passed', async () => {
      cookieStore.get.mockReturnValue({
        value: 'expired-by-exp-token',
      })

      verifyMock.mockReturnValue({
        id: 'user-1',
        exp: Math.floor(Date.now() / 1000) - 3600,
      })

      const result = await getSession()

      expect(result).toBeNull()

      expect(cookieStore.delete).toHaveBeenCalledWith('session')
    })

    it('normalizes missing optional session fields', async () => {
      cookieStore.get.mockReturnValue({
        value: 'minimal-token',
      })

      verifyMock.mockReturnValue({
        id: 'user-1',
      })

      const result = await getSession()

      expect(result).toEqual({
        id: 'user-1',
        email: null,
        phone: null,
        role: 'USER',
      })
    })

    it('throws INTERNAL_ERROR when session verification fails unexpectedly', async () => {
      cookieStore.get.mockReturnValue({
        value: 'jwt-token',
      })

      verifyMock.mockImplementation(() => {
        throw new Error('unexpected verification failure')
      })

      await expect(getSession()).rejects.toThrow(
        expect.objectContaining({
          code: ErrorCode.INTERNAL_ERROR.code,
        }),
      )

      expect(cookieStore.delete).not.toHaveBeenCalled()
    })
  })

  describe('getSessionFromRequest', () => {
    it('returns null when no session cookie exists', () => {
      const req = {
        cookies: {
          get: vi.fn().mockReturnValue(undefined),
        },
      } as any

      const result = getSessionFromRequest(req)

      expect(result).toBeNull()
      expect(verifyMock).not.toHaveBeenCalled()
    })

    it('returns the session payload from a valid request cookie', () => {
      const req = {
        cookies: {
          get: vi.fn().mockReturnValue({
            value: 'jwt-token',
          }),
        },
      } as any

      verifyMock.mockReturnValue({
        id: 'user-1',
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
        exp: Math.floor(Date.now() / 1000) + 3600,
      })

      const result = getSessionFromRequest(req)

      expect(result).toEqual({
        id: 'user-1',
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
      })

      expect(req.cookies.get).toHaveBeenCalledWith('session')
      expect(verifyMock).toHaveBeenCalledWith('jwt-token', 'test-secret')
    })

    it('returns null when the request token is invalid', () => {
      const req = {
        cookies: {
          get: vi.fn().mockReturnValue({
            value: 'invalid-token',
          }),
        },
      } as any

      verifyMock.mockImplementation(() => {
        const error = new Error('invalid token')
        error.name = 'JsonWebTokenError'
        throw error
      })

      const result = getSessionFromRequest(req)

      expect(result).toBeNull()
      expect(cookieStore.delete).not.toHaveBeenCalled()
    })

    it('returns null when the request token is expired', () => {
      const req = {
        cookies: {
          get: vi.fn().mockReturnValue({
            value: 'expired-token',
          }),
        },
      } as any

      verifyMock.mockImplementation(() => {
        const error = new Error('jwt expired')
        error.name = 'TokenExpiredError'
        throw error
      })

      const result = getSessionFromRequest(req)

      expect(result).toBeNull()
      expect(cookieStore.delete).not.toHaveBeenCalled()
    })

    it('returns null when the decoded request token is not an object', () => {
      const req = {
        cookies: {
          get: vi.fn().mockReturnValue({
            value: 'malformed-token',
          }),
        },
      } as any

      verifyMock.mockReturnValue(null)

      const result = getSessionFromRequest(req)

      expect(result).toBeNull()
      expect(cookieStore.delete).not.toHaveBeenCalled()
    })

    it('returns null when the request token has no session id', () => {
      const req = {
        cookies: {
          get: vi.fn().mockReturnValue({
            value: 'token-without-id',
          }),
        },
      } as any

      verifyMock.mockReturnValue({
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
      })

      const result = getSessionFromRequest(req)

      expect(result).toBeNull()
      expect(cookieStore.delete).not.toHaveBeenCalled()
    })

    it('returns null when the request token has a non-string session id', () => {
      const req = {
        cookies: {
          get: vi.fn().mockReturnValue({
            value: 'token-with-invalid-id',
          }),
        },
      } as any

      verifyMock.mockReturnValue({
        id: 123,
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
      })

      const result = getSessionFromRequest(req)

      expect(result).toBeNull()
      expect(cookieStore.delete).not.toHaveBeenCalled()
    })

    it('returns null when the request token expiration timestamp has passed', () => {
      const req = {
        cookies: {
          get: vi.fn().mockReturnValue({
            value: 'expired-by-exp-token',
          }),
        },
      } as any

      verifyMock.mockReturnValue({
        id: 'user-1',
        exp: Math.floor(Date.now() / 1000) - 3600,
      })

      const result = getSessionFromRequest(req)

      expect(result).toBeNull()
      expect(cookieStore.delete).not.toHaveBeenCalled()
    })

    it('returns null when request session verification fails unexpectedly', () => {
      const req = {
        cookies: {
          get: vi.fn().mockReturnValue({
            value: 'jwt-token',
          }),
        },
      } as any

      verifyMock.mockImplementation(() => {
        throw new Error('unexpected verification failure')
      })

      const result = getSessionFromRequest(req)

      expect(result).toBeNull()
      expect(cookieStore.delete).not.toHaveBeenCalled()
    })

    it('throws UNAUTHORIZED when there is no session', async () => {
      cookieStore.get.mockReturnValue(undefined)

      await expect(requireAuthority({ requiredRole: 'USER' })).rejects.toThrow(
        expect.objectContaining({
          code: ErrorCode.UNAUTHORIZED.code,
        }),
      )
    })

    it('returns the session when the user has the required role', async () => {
      cookieStore.get.mockReturnValue({
        value: 'jwt-token',
      })

      verifyMock.mockReturnValue({
        id: 'user-1',
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
      })

      const result = await requireAuthority({
        requiredRole: 'USER',
      })

      expect(result).toEqual({
        id: 'user-1',
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
      })
    })

    it('allows an ADMIN session when USER authority is required', async () => {
      cookieStore.get.mockReturnValue({
        value: 'admin-token',
      })

      verifyMock.mockReturnValue({
        id: 'admin-1',
        email: 'admin@example.com',
        phone: null,
        role: 'ADMIN',
      })

      const result = await requireAuthority({
        requiredRole: 'USER',
      })

      expect(result).toEqual({
        id: 'admin-1',
        email: 'admin@example.com',
        phone: null,
        role: 'ADMIN',
      })
    })

    it('throws UNAUTHORIZED when the session role does not match the required role', async () => {
      cookieStore.get.mockReturnValue({
        value: 'user-token',
      })

      verifyMock.mockReturnValue({
        id: 'user-1',
        email: 'user@example.com',
        phone: null,
        role: 'USER',
      })

      await expect(requireAuthority({ requiredRole: 'ADMIN' })).rejects.toThrow(
        expect.objectContaining({
          code: ErrorCode.UNAUTHORIZED.code,
        }),
      )
    })

    it('does nothing when there is no session cookie', async () => {
      cookieStore.get.mockReturnValue(undefined)

      await refreshSessionIfNeeded()

      expect(verifyMock).not.toHaveBeenCalled()
      expect(signMock).not.toHaveBeenCalled()
      expect(cookieStore.set).not.toHaveBeenCalled()
    })

    it('does not refresh a session with more than 24 hours remaining', async () => {
      cookieStore.get.mockReturnValue({
        value: 'jwt-token',
      })

      verifyMock.mockReturnValue({
        id: 'user-1',
        email: 'user@example.com',
        phone: null,
        role: 'USER',
        exp: Math.floor(Date.now() / 1000) + 48 * 60 * 60,
      })

      await refreshSessionIfNeeded()

      expect(verifyMock).toHaveBeenCalledWith('jwt-token', 'test-secret')
      expect(signMock).not.toHaveBeenCalled()
      expect(cookieStore.set).not.toHaveBeenCalled()
    })

    it('refreshes a session with less than 24 hours remaining', async () => {
      cookieStore.get.mockReturnValue({
        value: 'old-token',
      })

      verifyMock.mockReturnValue({
        id: 'user-1',
        email: 'user@example.com',
        phone: '+123456789',
        role: 'USER',
        exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
      })

      signMock.mockReturnValue('new-token')

      await refreshSessionIfNeeded()

      expect(signMock).toHaveBeenCalledWith(
        {
          id: 'user-1',
          email: 'user@example.com',
          phone: '+123456789',
          role: 'USER',
        },
        'test-secret',
        {
          expiresIn: '7d',
        },
      )

      expect(cookieStore.set).toHaveBeenCalledWith(
        'session',
        'new-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        }),
      )
    })

    it('does not refresh an expired session', async () => {
      cookieStore.get.mockReturnValue({
        value: 'expired-token',
      })

      verifyMock.mockImplementation(() => {
        const error = new Error('jwt expired')
        error.name = 'TokenExpiredError'
        throw error
      })

      await refreshSessionIfNeeded()

      expect(signMock).not.toHaveBeenCalled()
      expect(cookieStore.set).not.toHaveBeenCalled()
    })

    it('does not refresh when session verification fails unexpectedly', async () => {
      cookieStore.get.mockReturnValue({
        value: 'jwt-token',
      })

      verifyMock.mockImplementation(() => {
        throw new Error('unexpected verification failure')
      })

      await refreshSessionIfNeeded()

      expect(signMock).not.toHaveBeenCalled()
      expect(cookieStore.set).not.toHaveBeenCalled()
    })
  })
})
