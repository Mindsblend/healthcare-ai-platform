import { beforeEach, describe, expect, it, vi } from 'vitest'

const {
  getOtpMock,
  deleteOtpMock,
  registerOtpVerificationAttemptMock,
  createDomainErrorMock,
} = vi.hoisted(() => ({
  getOtpMock: vi.fn(),
  deleteOtpMock: vi.fn(),
  registerOtpVerificationAttemptMock: vi.fn(),
  createDomainErrorMock: vi.fn((error: { code: string; message: string }) =>
    Object.assign(new Error(error.message), { code: error.code }),
  ),
}))

vi.mock('@/features/auth/services/lifeCycleOtpService', () => ({
  getOtp: getOtpMock,
  deleteOtp: deleteOtpMock,
  registerOtpVerificationAttempt: registerOtpVerificationAttemptMock,
  OTP_VERIFICATION_ATTEMPT_LIMIT: 5,
}))

vi.mock('@/lib/errors', () => ({
  createDomainError: createDomainErrorMock,
  ErrorCode: {
    OTP_INVALID: { code: 'OTP_INVALID', message: 'Invalid OTP' },
    OTP_EXPIRED: { code: 'OTP_EXPIRED', message: 'Expired OTP' },
    OTP_TOO_MANY_ATTEMPTS: {
      code: 'OTP_TOO_MANY_ATTEMPTS',
      message: 'Too many attempts',
    },
  },
}))

import { verifyOtp } from '@/features/auth/services/verifyOtpService'

describe('verifyOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getOtpMock.mockResolvedValue('123456')
    deleteOtpMock.mockResolvedValue(undefined)
    registerOtpVerificationAttemptMock.mockResolvedValue(1)
  })

  it('rejects when the code is missing', async () => {
    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '' }),
    ).rejects.toMatchObject({
      code: 'OTP_INVALID',
    })

    expect(getOtpMock).not.toHaveBeenCalled()
    expect(deleteOtpMock).not.toHaveBeenCalled()
    expect(registerOtpVerificationAttemptMock).not.toHaveBeenCalled()
  })

  it.each(['12345', '1234567', '12a456', '123456\n'])(
    'rejects malformed OTP values without counting an attempt: %s',
    async (code) => {
      await expect(
        verifyOtp({ identifier: 'user@example.com', code }),
      ).rejects.toMatchObject({ code: 'OTP_INVALID' })

      expect(getOtpMock).not.toHaveBeenCalled()
      expect(registerOtpVerificationAttemptMock).not.toHaveBeenCalled()
    },
  )

  it('rejects non-string OTP values without reading Redis', async () => {
    const invalidInput = {
      identifier: 'user@example.com',
      code: 123456,
    }

    await expect(
      Reflect.apply(verifyOtp, undefined, [invalidInput]),
    ).rejects.toMatchObject({ code: 'OTP_INVALID' })

    expect(getOtpMock).not.toHaveBeenCalled()
  })

  it('rejects when no OTP is stored', async () => {
    getOtpMock.mockResolvedValue(null)

    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '123456' }),
    ).rejects.toMatchObject({
      code: 'OTP_EXPIRED',
    })

    expect(getOtpMock).toHaveBeenCalledWith('user@example.com')
    expect(deleteOtpMock).not.toHaveBeenCalled()
    expect(registerOtpVerificationAttemptMock).not.toHaveBeenCalled()
  })

  it('rejects when the code does not match', async () => {
    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '654321' }),
    ).rejects.toMatchObject({
      code: 'OTP_INVALID',
    })

    expect(registerOtpVerificationAttemptMock).toHaveBeenCalledWith(
      'user@example.com',
    )
    expect(deleteOtpMock).not.toHaveBeenCalled()
  })

  it('invalidates the OTP when the failed-attempt limit is reached', async () => {
    registerOtpVerificationAttemptMock.mockResolvedValue(5)

    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '654321' }),
    ).rejects.toMatchObject({ code: 'OTP_TOO_MANY_ATTEMPTS' })

    expect(deleteOtpMock).toHaveBeenCalledWith('user@example.com')
  })

  it('returns success and deletes the OTP when the code matches', async () => {
    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '123456' }),
    ).resolves.toEqual({ success: true })

    expect(getOtpMock).toHaveBeenCalledWith('user@example.com')
    expect(deleteOtpMock).toHaveBeenCalledWith('user@example.com')
    expect(deleteOtpMock).toHaveBeenCalledOnce()
    expect(registerOtpVerificationAttemptMock).not.toHaveBeenCalled()
  })

  it('propagates an error if deleting the OTP fails', async () => {
    deleteOtpMock.mockRejectedValue(new Error('Redis deletion failed'))

    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '123456' }),
    ).rejects.toThrow('Redis deletion failed')
  })
})
