import { beforeEach, describe, expect, it, vi } from 'vitest'

const redisMock = vi.hoisted(() => ({
  eval: vi.fn(),
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  incr: vi.fn(),
  expire: vi.fn(),
}))

vi.mock('@/lib/redis', () => ({
  default: redisMock,
}))

vi.mock('@/lib/errors', () => ({
  createDomainError: (error: { code: string }, details?: unknown) =>
    Object.assign(new Error(error.code), { code: error.code, details }),
  ErrorCode: {
    OTP_COOLDOWN_ACTIVE: { code: 'OTP_COOLDOWN_ACTIVE' },
    OTP_RATE_LIMIT: { code: 'OTP_RATE_LIMIT' },
  },
}))

import {
  checkOtpRateLimit,
  deleteOtp,
  getOtp,
  registerOtpVerificationAttempt,
  saveOtp,
} from '@/features/auth/services/lifeCycleOtpService'

describe('lifeCycleOtpService', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    redisMock.eval.mockResolvedValue(1)
    redisMock.get.mockResolvedValue(null)
    redisMock.set.mockResolvedValue('OK')
    redisMock.del.mockResolvedValue(1)
    redisMock.incr.mockResolvedValue(1)
    redisMock.expire.mockResolvedValue(1)
  })

  describe('checkOtpRateLimit', () => {
    it('atomically applies the request limit, expiry, and cooldown', async () => {
      await checkOtpRateLimit('User@Example.com')

      expect(redisMock.eval).toHaveBeenCalledWith(
        expect.stringContaining("redis.call('INCR', KEYS[1])"),
        2,
        'otp_requests_v2:user@example.com',
        'otp_cooldown:user@example.com',
        4,
        90,
        30,
      )
    })

    it('rejects requests during the cooldown', async () => {
      redisMock.eval.mockResolvedValueOnce(-1)

      await expect(checkOtpRateLimit('user@example.com')).rejects.toMatchObject(
        { code: 'OTP_COOLDOWN_ACTIVE' },
      )
    })

    it('rejects requests after the request limit is reached', async () => {
      redisMock.eval.mockResolvedValueOnce(-2)

      await expect(checkOtpRateLimit('user@example.com')).rejects.toMatchObject(
        { code: 'OTP_RATE_LIMIT' },
      )
    })

    it('fails explicitly when Redis returns an unexpected result', async () => {
      redisMock.eval.mockResolvedValueOnce('unexpected')

      await expect(checkOtpRateLimit('user@example.com')).rejects.toThrow(
        'Unexpected OTP rate-limit response from Redis',
      )
    })
  })

  describe('saveOtp', () => {
    it('stores the OTP with its expiry and resets prior verification attempts', async () => {
      await saveOtp('+989123456789', '123456')

      expect(redisMock.set).toHaveBeenCalledWith(
        'otp:+989123456789',
        '123456',
        'EX',
        90,
      )
      expect(redisMock.del).toHaveBeenCalledWith('otp_attempts:+989123456789')
    })
  })

  describe('getOtp', () => {
    it('returns the stored OTP', async () => {
      redisMock.get.mockResolvedValue('123456')

      await expect(getOtp('+989123456789')).resolves.toBe('123456')
      expect(redisMock.get).toHaveBeenCalledWith('otp:+989123456789')
    })

    it('returns null when no OTP exists', async () => {
      redisMock.get.mockResolvedValue(null)

      await expect(getOtp('+989123456789')).resolves.toBeNull()
    })
  })

  describe('registerOtpVerificationAttempt', () => {
    it('sets an expiry for the first failed attempt', async () => {
      await expect(
        registerOtpVerificationAttempt('User@Example.com'),
      ).resolves.toBe(1)

      expect(redisMock.incr).toHaveBeenCalledWith(
        'otp_attempts:user@example.com',
      )
      expect(redisMock.expire).toHaveBeenCalledWith(
        'otp_attempts:user@example.com',
        90,
      )
    })

    it('does not extend the expiry for subsequent failed attempts', async () => {
      redisMock.incr.mockResolvedValueOnce(2)

      await expect(
        registerOtpVerificationAttempt('user@example.com'),
      ).resolves.toBe(2)

      expect(redisMock.expire).not.toHaveBeenCalled()
    })
  })

  describe('deleteOtp', () => {
    it('deletes the OTP and its failed-attempt counter', async () => {
      await deleteOtp('+989123456789')

      expect(redisMock.del).toHaveBeenCalledWith(
        'otp:+989123456789',
        'otp_attempts:+989123456789',
      )
    })
  })
})
