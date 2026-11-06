import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const {
  verifyOtpMock,
  createUserMock,
  createJwtSessionMock,
  setSessionCookieMock,
  validateAuthenticationIdentifierMock,
} = vi.hoisted(() => ({
  verifyOtpMock: vi.fn(),
  createUserMock: vi.fn(),
  createJwtSessionMock: vi.fn(),
  setSessionCookieMock: vi.fn(),
  validateAuthenticationIdentifierMock: vi.fn(),
}))

vi.mock('@/features/auth/services/verifyOtpService', () => ({
  verifyOtp: verifyOtpMock,
}))

vi.mock('@/features/shop/services/UserService', () => ({
  UserService: {
    createUser: createUserMock,
  },
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  createJwtSession: createJwtSessionMock,
  setSessionCookie: setSessionCookieMock,
}))

vi.mock('@/lib/helpers', () => ({
  validateAuthenticationIdentifier: validateAuthenticationIdentifierMock,
}))

import { POST } from '@/app/api/auth/authorize/route'

describe('POST /api/auth/authorize', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    validateAuthenticationIdentifierMock.mockResolvedValue({
      type: 'email',
      value: 'test@example.com',
    })
    verifyOtpMock.mockResolvedValue({ success: true })
    createUserMock.mockResolvedValue({
      id: 'user-123',
      email: 'test@example.com',
      phone: null,
      role: 'USER',
    })
    createJwtSessionMock.mockReturnValue('test-session-token')
    setSessionCookieMock.mockResolvedValue(undefined)
  })

  const makeRequest = (body: unknown) =>
    new NextRequest('http://localhost/api/auth/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  it('authorizes an email user and sets the session cookie', async () => {
    const response = await POST(
      makeRequest({ identifier: 'test@example.com', code: '123456' }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      redirect: '/',
    })
    expect(verifyOtpMock).toHaveBeenCalledWith({
      identifier: 'test@example.com',
      code: '123456',
    })
    expect(createUserMock).toHaveBeenCalledWith('test@example.com', 'email')
    expect(createJwtSessionMock).toHaveBeenCalledWith({
      id: 'user-123',
      email: 'test@example.com',
      phone: null,
      role: 'USER',
    })
    expect(setSessionCookieMock).toHaveBeenCalledWith('test-session-token')
  })

  it('authorizes a phone user', async () => {
    validateAuthenticationIdentifierMock.mockResolvedValue({
      type: 'phone',
      value: '09123456789',
    })
    createUserMock.mockResolvedValue({
      id: 'user-456',
      email: null,
      phone: '09123456789',
      role: 'USER',
    })

    const response = await POST(
      makeRequest({ identifier: '09123456789', code: '654321' }),
    )

    expect(response.status).toBe(200)
    expect(verifyOtpMock).toHaveBeenCalledWith({
      identifier: '09123456789',
      code: '654321',
    })
    expect(createUserMock).toHaveBeenCalledWith('09123456789', 'phone')
    expect(setSessionCookieMock).toHaveBeenCalledWith('test-session-token')
  })

  it('does not create a user or session when OTP verification fails', async () => {
    verifyOtpMock.mockRejectedValue({
      code: 'OTP_INVALID',
      message: 'Invalid OTP',
    })

    const response = await POST(
      makeRequest({ identifier: 'test@example.com', code: 'wrong' }),
    )

    expect(response.status).toBe(400)
    expect(createUserMock).not.toHaveBeenCalled()
    expect(createJwtSessionMock).not.toHaveBeenCalled()
    expect(setSessionCookieMock).not.toHaveBeenCalled()
  })

  it('returns 400 for an invalid identifier', async () => {
    validateAuthenticationIdentifierMock.mockRejectedValue({
      code: 'INVALID_IDENTIFIER',
      message: 'Invalid identifier',
    })

    const response = await POST(
      makeRequest({ identifier: 'invalid', code: '123456' }),
    )

    expect(response.status).toBe(400)
    expect(verifyOtpMock).not.toHaveBeenCalled()
    expect(createUserMock).not.toHaveBeenCalled()
    expect(setSessionCookieMock).not.toHaveBeenCalled()
  })

  it('returns 500 when user creation fails', async () => {
    createUserMock.mockRejectedValue(new Error('Database unavailable'))

    const response = await POST(
      makeRequest({ identifier: 'test@example.com', code: '123456' }),
    )

    expect(response.status).toBe(500)
    expect(createJwtSessionMock).not.toHaveBeenCalled()
    expect(setSessionCookieMock).not.toHaveBeenCalled()
  })

  it('returns 500 when session creation fails', async () => {
    createJwtSessionMock.mockImplementation(() => {
      throw new Error('Session creation failed')
    })

    const response = await POST(
      makeRequest({ identifier: 'test@example.com', code: '123456' }),
    )

    expect(response.status).toBe(500)
    expect(setSessionCookieMock).not.toHaveBeenCalled()
  })

  it('returns 500 when setting the session cookie fails', async () => {
    setSessionCookieMock.mockRejectedValue(new Error('Cookie unavailable'))

    const response = await POST(
      makeRequest({ identifier: 'test@example.com', code: '123456' }),
    )

    expect(response.status).toBe(500)
    expect(createJwtSessionMock).toHaveBeenCalledOnce()
  })

  it('returns 500 for malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/auth/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid-json',
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(validateAuthenticationIdentifierMock).not.toHaveBeenCalled()
    expect(verifyOtpMock).not.toHaveBeenCalled()
  })
})
