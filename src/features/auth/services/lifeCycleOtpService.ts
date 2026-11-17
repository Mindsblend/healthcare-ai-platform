import redis from '@/lib/redis'
import { createDomainError, ErrorCode } from '@/lib/errors'

const OTP_RATE_LIMIT = 4 // Maximum requests in the rate-limit window
const OTP_RATE_LIMIT_WINDOW = 3 * 30 // Ninety seconds
const OTP_COOLDOWN = 30 // Cooldown between requests in seconds
const TTL = 3 * 30 // Total Response Time (TTS)
export const OTP_VERIFICATION_ATTEMPT_LIMIT = 5

const OTP_RATE_LIMIT_SCRIPT = `
local cooldown = redis.call('GET', KEYS[2])
if cooldown then return -1 end

local count = tonumber(redis.call('GET', KEYS[1]) or '0')
if count >= tonumber(ARGV[1]) then return -2 end

count = redis.call('INCR', KEYS[1])
if count == 1 then redis.call('EXPIRE', KEYS[1], ARGV[2]) end
redis.call('SET', KEYS[2], '1', 'EX', ARGV[3])
return count
`

export async function checkOtpRateLimit(identifier: string) {
  const key = `otp_requests_v2:${identifier.toLowerCase()}`
  const cooldownKey = `otp_cooldown:${identifier.toLowerCase()}`

  const result = Number(
    await redis.eval(
      OTP_RATE_LIMIT_SCRIPT,
      2,
      key,
      cooldownKey,
      OTP_RATE_LIMIT,
      OTP_RATE_LIMIT_WINDOW,
      OTP_COOLDOWN,
    ),
  )

  if (result === -1) {
    throw createDomainError(ErrorCode.OTP_COOLDOWN_ACTIVE)
  }
  if (result === -2) {
    throw createDomainError(ErrorCode.OTP_RATE_LIMIT)
  }
  if (!Number.isInteger(result) || result < 1) {
    throw new Error('Unexpected OTP rate-limit response from Redis')
  }
}

export async function saveOtp(phone: string, code: string) {
  await redis.set(`otp:${phone}`, code, 'EX', TTL)
  await redis.del(`otp_attempts:${phone.toLowerCase()}`)
}

export async function getOtp(phone: string) {
  return redis.get(`otp:${phone}`)
}

export async function registerOtpVerificationAttempt(identifier: string) {
  const key = `otp_attempts:${identifier.toLowerCase()}`
  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, TTL)
  }

  return count
}

export async function deleteOtp(phone: string) {
  await redis.del(`otp:${phone}`, `otp_attempts:${phone.toLowerCase()}`)
}
