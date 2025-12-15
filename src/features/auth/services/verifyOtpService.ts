import { getOtp, deleteOtp } from './storeOtpService'

export async function verifyOtp(phone: string, inputCode: string) {
  const storedCode = await getOtp(phone)

  // No OTP exists (expired or never sent)
  if (!storedCode) {
    throw new Error('OTP_EXPIRED_OR_INVALID')
  }

  // Wrong code
  if (storedCode !== inputCode) {
    throw new Error('OTP_INVALID')
  }

  // SUCCESS → invalidate immediately
  await deleteOtp(phone)

  return true
}
