
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { redisMock, multiMock } = vi.hoisted(() => {
  const multi = {
    incr: vi.fn(),
    expire: vi.fn(),
    set: vi.fn(),
    exec: vi.fn(),
  }

  return {
    multiMock: multi,
    redisMock: {
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      multi: vi.fn(() => multi),
    },
  }
})

vi.mock('@/lib/redis', () => ({
  default: redisMock,
}))

vi.mock('@/lib/errors', () => ({
  createDomainError: (code: string, details?: unknown) =>
    Object.assign(new Error(code), { code, details }),
  ErrorCode: {
    OTP_COOLDOWN_ACTIVE: 'OTP_COOLDOWN_ACTIVE',
    OTP_RATE_LIMIT: 'OTP_RATE_LIMIT',
  },
}))

import {
  checkOtpRateLimit,
  saveOtp,
  getOtp,
  deleteOtp,
} from '@/features/auth/services/lifeCycleOtpService'

describe('lifeCycleOtpService', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    redisMock.get.mockResolvedValue(null)
    redisMock.set.mockResolvedValue('OK')
    redisMock.del.mockResolvedValue(1)

    multiMock.incr.mockReturnThis()
    multiMock.expire.mockReturnThis()
    multiMock.set.mockReturnThis()
    multiMock.exec.mockResolvedValue([])
  })

  describe('checkOtpRateLimit', () => {
    it('increments the request count and sets expiry on the first request', async () => {
      await checkOtpRateLimit('User@Example.com')

      expect(redisMock.get).toHaveBeenNthCalledWith(
        1,
        'otp_cooldown:user@example.com',
      )
      expect(redisMock.get).toHaveBeenNthCalledWith(
        2,
        'otp_requests:user@example.com',
      )
      expect(multiMock.incr).toHaveBeenCalledWith(
        'otp_requests:user@example.com',
      )
      expect(multiMock.expire).toHaveBeenCalledWith(
        'otp_requests:user@example.com',
        3600,
      )
      expect(multiMock.set).toHaveBeenCalledWith(
        'otp_cooldown:user@example.com',
        '1',
        'EX',
        60,
      )
      expect(multiMock.exec).toHaveBeenCalledOnce()
    })

    it('does not reset the hourly expiry when a count exists', async () => {
      redisMock.get
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('1')

      await checkOtpRateLimit('user@example.com')

      expect(multiMock.incr).toHaveBeenCalledOnce()
      expect(multiMock.expire).not.toHaveBeenCalled()
      expect(multiMock.exec).toHaveBeenCalledOnce()
    })

    it('throws when the identifier is on cooldown', async () => {
      redisMock.get.mockResolvedValueOnce('1')

      await expect(
        checkOtpRateLimit('user@example.com'),
      ).rejects.toMatchObject({
        code: 'OTP_COOLDOWN_ACTIVE',
      })

      expect(multiMock.exec).not.toHaveBeenCalled()
    })

    it('throws when the hourly rate limit is reached', async () => {
      redisMock.get
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('3')

      await expect(
        checkOtpRateLimit('user@example.com'),
      ).rejects.toMatchObject({
        code: 'OTP_RATE_LIMIT',
      })

      expect(multiMock.exec).not.toHaveBeenCalled()
    })
  })

  describe('saveOtp', () => {
    it('stores the OTP with a three-minute expiry', async () => {
      await saveOtp('+989123456789', '123456')

      expect(redisMock.set).toHaveBeenCalledWith(
        'otp:+989123456789',
        '123456',
        'EX',
        180,
      )
    })
  })

  describe('getOtp', () => {
    it('returns the stored OTP', async () => {
      redisMock.get.mockResolvedValue('123456')

      await expect(getOtp('+989123456789')).resolves.toBe('123456')

      expect(redisMock.get).toHaveBeenCalledWith(
        'otp:+989123456789',
      )
    })

    it('returns null when no OTP exists', async () => {
      redisMock.get.mockResolvedValue(null)

      await expect(getOtp('+989123456789')).resolves.toBeNull()
    })
  })

  describe('deleteOtp', () => {
    it('deletes the OTP key', async () => {
      await deleteOtp('+989123456789')

      expect(redisMock.del).toHaveBeenCalledWith(
        'otp:+989123456789',
      )
    })
  })
})
