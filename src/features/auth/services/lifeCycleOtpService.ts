import redis from '@/lib/redis'
import { createDomainError, ErrorCode } from '@/lib/errors'

const OTP_RATE_LIMIT = 3 // Maximize attempts
const OTP_RATE_LIMIT_WINDOW = 60 * 60 // Possible attempts per hour
const OTP_COOLDOWN = 60 // Cool down for 60 seconds between requests
const TTL = 3 * 60 // Total Response Time (TTS)

export async function checkOtpRateLimit(identifier: string) {
  const key = `otp_requests:${identifier.toLowerCase()}`
  const cooldownKey = `otp_cooldown:${identifier.toLowerCase()}`

  // Check cooldown
  const onCooldown = await redis.get(cooldownKey)
  if (onCooldown) {
    throw createDomainError(ErrorCode.OTP_COOLDOWN_ACTIVE)
  }

  // Check hourly limit
  const count = await redis.get(key)
  if (count && parseInt(count) >= OTP_RATE_LIMIT) {
    throw createDomainError(ErrorCode.OTP_RATE_LIMIT)
  }

  // Increment request count and set TTL if this is the first request
  const multi = redis.multi()
  multi.incr(key)
  if (!count) multi.expire(key, OTP_RATE_LIMIT_WINDOW)

  // Set cooldown key
  multi.set(cooldownKey, '1', 'EX', OTP_COOLDOWN)

  await multi.exec()
}

export async function saveOtp(phone: string, code: string) {
  console.log('[SAVE OTP] key:', JSON.stringify(phone))
  console.log('[REDIS URL]', process.env.REDIS_URL)
  console.log('[SAVE OTP]', phone, code, typeof code)
  await redis.set(`otp:${phone}`, code, 'EX', TTL)
}

export async function getOtp(phone: string) {
  console.log('[GET OTP] key:', JSON.stringify(phone))
  console.log('[REDIS URL]', process.env.REDIS_URL)
  return redis.get(`otp:${phone}`)
}

export async function deleteOtp(phone: string) {
  await redis.del(`otp:${phone}`)
}
