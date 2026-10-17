import jwt from 'jsonwebtoken'
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('verifyToken', () => {
  const secret = 'test-jwt-secret'

  beforeEach(() => {
    vi.resetModules()
    process.env.JWT_SECRET = secret
  })

  async function loadVerifyToken() {
    const service = await import('@/features/auth/services/verifyToken')
    return service.verifyToken
  }

  it('returns the session for a valid token with id and role', async () => {
    const verifyToken = await loadVerifyToken()
    const token = jwt.sign({ id: 'user-123', role: 'user' }, secret, {
      expiresIn: '1h',
    })

    expect(verifyToken({ token })).toEqual({
      id: 'user-123',
      role: 'user',
    })
  })

  it('returns null for an invalid token', async () => {
    const verifyToken = await loadVerifyToken()

    expect(verifyToken({ token: 'invalid-token' })).toBeNull()
  })

  it('returns null for a token signed with a different secret', async () => {
    const verifyToken = await loadVerifyToken()
    const token = jwt.sign({ id: 'user-123', role: 'user' }, 'different-secret')

    expect(verifyToken({ token })).toBeNull()
  })

  it('returns null for an expired token', async () => {
    const verifyToken = await loadVerifyToken()
    const token = jwt.sign({ id: 'user-123', role: 'user' }, secret, {
      expiresIn: -1,
    })

    expect(verifyToken({ token })).toBeNull()
  })

  it('returns null when the token payload has no id', async () => {
    const verifyToken = await loadVerifyToken()
    const token = jwt.sign({ role: 'user' }, secret)

    expect(verifyToken({ token })).toBeNull()
  })

  it('returns null when the token payload has no role', async () => {
    const verifyToken = await loadVerifyToken()
    const token = jwt.sign({ id: 'user-123' }, secret)

    expect(verifyToken({ token })).toBeNull()
  })

  it('returns null when id or role is not a string', async () => {
    const verifyToken = await loadVerifyToken()
    const token = jwt.sign({ id: 123, role: 'user' }, secret)

    expect(verifyToken({ token })).toBeNull()
  })
})
