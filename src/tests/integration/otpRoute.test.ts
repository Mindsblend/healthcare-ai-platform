import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const {
  sendOtpViaSmsMock,
  sendOtpViaEmailMock,
  checkOtpRateLimitMock,
  saveOtpMock,
  validateAuthenticationIdentifierMock,
} = vi.hoisted(() => ({
  sendOtpViaSmsMock: vi.fn(),
  sendOtpViaEmailMock: vi.fn(),
  checkOtpRateLimitMock: vi.fn(),
  saveOtpMock: vi.fn(),
  validateAuthenticationIdentifierMock: vi.fn(),
}))

vi.mock('@/features/auth/services/lifeCycleOtpService', () => ({
  checkOtpRateLimit: checkOtpRateLimitMock,
  saveOtp: saveOtpMock,
}))

vi.mock('@/features/auth/services/sendSmsOtpService', () => ({
  sendOtpViaSms: sendOtpViaSmsMock,
}))

vi.mock('@/features/auth/services/sendEmailOtpService', () => ({
  sendOtpViaEmail: sendOtpViaEmailMock,
}))

vi.mock('@/lib/helpers', () => ({
  validateAuthenticationIdentifier: validateAuthenticationIdentifierMock,
}))

import { POST } from '@/app/api/auth/otp/route'

describe('POST /api/auth/otp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    checkOtpRateLimitMock.mockResolvedValue(undefined)
    saveOtpMock.mockResolvedValue(undefined)
  })

  const makeRequest = (body: unknown) =>
    new NextRequest('http://localhost/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  it('sends and stores an email OTP', async () => {
    validateAuthenticationIdentifierMock.mockResolvedValue({
      type: 'email',
      value: 'test@example.com',
    })
    sendOtpViaEmailMock.mockResolvedValue('123456')

    const response = await POST(makeRequest({ identifier: 'test@example.com' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(checkOtpRateLimitMock).toHaveBeenCalledWith('test@example.com')
    expect(sendOtpViaEmailMock).toHaveBeenCalledWith('test@example.com')
    expect(saveOtpMock).toHaveBeenCalledWith('test@example.com', '123456')
    expect(sendOtpViaSmsMock).not.toHaveBeenCalled()
  })

  it('sends and stores an SMS OTP', async () => {
    validateAuthenticationIdentifierMock.mockResolvedValue({
      type: 'phone',
      value: '09123456789',
    })
    sendOtpViaSmsMock.mockResolvedValue({ code: '654321' })

    const response = await POST(makeRequest({ identifier: '09123456789' }))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ success: true })
    expect(checkOtpRateLimitMock).toHaveBeenCalledWith('09123456789')
    expect(sendOtpViaSmsMock).toHaveBeenCalledWith({
      phone: '09123456789',
    })
    expect(saveOtpMock).toHaveBeenCalledWith('09123456789', '654321')
    expect(sendOtpViaEmailMock).not.toHaveBeenCalled()
  })

  it('returns 400 for a validation error', async () => {
    validateAuthenticationIdentifierMock.mockRejectedValue({
      code: 'INVALID_IDENTIFIER',
      message: 'Invalid identifier',
    })

    const response = await POST(makeRequest({ identifier: 'invalid' }))

    expect(response.status).toBe(400)
    expect(sendOtpViaEmailMock).not.toHaveBeenCalled()
    expect(sendOtpViaSmsMock).not.toHaveBeenCalled()
    expect(saveOtpMock).not.toHaveBeenCalled()
  })

  it('does not send another code when the identifier is rate limited', async () => {
    validateAuthenticationIdentifierMock.mockResolvedValue({
      type: 'phone',
      value: '09123456789',
    })
    checkOtpRateLimitMock.mockRejectedValue({
      code: 'OTP_COOLDOWN_ACTIVE',
      message: 'Please wait before requesting another code',
    })

    const response = await POST(makeRequest({ identifier: '09123456789' }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'OTP_COOLDOWN_ACTIVE' },
    })
    expect(sendOtpViaSmsMock).not.toHaveBeenCalled()
    expect(sendOtpViaEmailMock).not.toHaveBeenCalled()
    expect(saveOtpMock).not.toHaveBeenCalled()
  })

  it('returns the request-limit error without contacting a delivery provider', async () => {
    validateAuthenticationIdentifierMock.mockResolvedValue({
      type: 'email',
      value: 'test@gmail.com',
    })
    checkOtpRateLimitMock.mockRejectedValue({
      code: 'OTP_RATE_LIMIT',
      message: 'Request limit reached',
    })

    const response = await POST(makeRequest({ identifier: 'test@gmail.com' }))

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'OTP_RATE_LIMIT' },
    })
    expect(sendOtpViaEmailMock).not.toHaveBeenCalled()
    expect(sendOtpViaSmsMock).not.toHaveBeenCalled()
    expect(saveOtpMock).not.toHaveBeenCalled()
  })

  it('returns 502 when email delivery fails', async () => {
    validateAuthenticationIdentifierMock.mockResolvedValue({
      type: 'email',
      value: 'test@example.com',
    })
    sendOtpViaEmailMock.mockRejectedValue(
      Object.assign(new Error('Email provider unavailable'), {
        code: 'EMAIL_PROVIDER_FAILED',
      }),
    )

    const response = await POST(makeRequest({ identifier: 'test@example.com' }))

    expect(response.status).toBe(502)
    expect(saveOtpMock).not.toHaveBeenCalled()
  })

  it('returns 500 when SMS delivery fails', async () => {
    validateAuthenticationIdentifierMock.mockResolvedValue({
      type: 'phone',
      value: '09123456789',
    })
    sendOtpViaSmsMock.mockRejectedValue(new Error('SMS provider unavailable'))

    const response = await POST(makeRequest({ identifier: '09123456789' }))

    expect(response.status).toBe(500)
    expect(saveOtpMock).not.toHaveBeenCalled()
  })

  it('returns 500 when storing the email OTP fails', async () => {
    validateAuthenticationIdentifierMock.mockResolvedValue({
      type: 'email',
      value: 'test@example.com',
    })
    sendOtpViaEmailMock.mockResolvedValue('123456')
    saveOtpMock.mockRejectedValue(new Error('OTP storage unavailable'))

    const response = await POST(makeRequest({ identifier: 'test@example.com' }))

    expect(response.status).toBe(500)
    expect(sendOtpViaEmailMock).toHaveBeenCalledOnce()
    expect(saveOtpMock).toHaveBeenCalledWith('test@example.com', '123456')
  })

  it('returns 400 for malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/auth/otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid-json',
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
    expect(validateAuthenticationIdentifierMock).not.toHaveBeenCalled()
    expect(sendOtpViaEmailMock).not.toHaveBeenCalled()
    expect(sendOtpViaSmsMock).not.toHaveBeenCalled()
  })

  it('returns 400 when the request body is not an object', async () => {
    const response = await POST(makeRequest(null))

    expect(response.status).toBe(400)
    expect(validateAuthenticationIdentifierMock).not.toHaveBeenCalled()
    expect(checkOtpRateLimitMock).not.toHaveBeenCalled()
  })
})
