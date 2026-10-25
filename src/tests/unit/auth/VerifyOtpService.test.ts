import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getOtpMock, deleteOtpMock, createDomainErrorMock } = vi.hoisted(() => ({
  getOtpMock: vi.fn(),
  deleteOtpMock: vi.fn(),
  createDomainErrorMock: vi.fn((code: string) =>
    Object.assign(new Error(code), { code }),
  ),
}))

vi.mock('@/features/auth/services/lifeCycleOtpService', () => ({
  getOtp: getOtpMock,
  deleteOtp: deleteOtpMock,
}))

vi.mock('@/lib/errors', () => ({
  createDomainError: createDomainErrorMock,
  ErrorCode: {
    OTP_INVALID: 'OTP_INVALID',
    OTP_EXPIRED: 'OTP_EXPIRED',
  },
}))

import { verifyOtp } from '@/features/auth/services/verifyOtpService'

describe('verifyOtp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getOtpMock.mockResolvedValue('123456')
    deleteOtpMock.mockResolvedValue(undefined)
  })

  it('rejects when the code is missing', async () => {
    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '' }),
    ).rejects.toMatchObject({
      code: 'OTP_INVALID',
    })

    expect(getOtpMock).not.toHaveBeenCalled()
    expect(deleteOtpMock).not.toHaveBeenCalled()
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
  })

  it('rejects when the code does not match', async () => {
    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '654321' }),
    ).rejects.toMatchObject({
      code: 'OTP_INVALID',
    })

    expect(deleteOtpMock).not.toHaveBeenCalled()
  })

  it('returns success and deletes the OTP when the code matches', async () => {
    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '123456' }),
    ).resolves.toEqual({ success: true })

    expect(getOtpMock).toHaveBeenCalledWith('user@example.com')
    expect(deleteOtpMock).toHaveBeenCalledWith('user@example.com')
    expect(deleteOtpMock).toHaveBeenCalledOnce()
  })

  it('propagates an error if deleting the OTP fails', async () => {
    deleteOtpMock.mockRejectedValue(new Error('Redis deletion failed'))

    await expect(
      verifyOtp({ identifier: 'user@example.com', code: '123456' }),
    ).rejects.toThrow('Redis deletion failed')
  })
})
