import redis from '@/lib/redis'

const TTL = 3 * 60 // Total Response Time (TTS)

export async function saveOtp(phone: string, code: string) {
  await redis.set(`otp:${phone}`, code, 'EX', TTL)
}

export async function getOtp(phone: string) {
  return redis.get(`otp:${phone}`)
}

export async function deleteOtp(phone: string) {
  await redis.del(`otp:${phone}`)
}
