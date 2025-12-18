import redis from '@/lib/redis'

const TTL = 3 * 60 // Total Response Time (TTS)

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
