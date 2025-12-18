import { getOtp, deleteOtp } from './storeOtpService'
import { createDomainError, ErrorCode } from '@/lib/errors'

export async function verifyOtp(phone: string, inputCode: string) {
  // Validate arguments
  if (!phone) throw createDomainError(ErrorCode.MISSING_PHONE_NUMBER)
  if (!inputCode) throw createDomainError(ErrorCode.OTP_INVALID)

  const storedCode = await getOtp(phone)

  console.log('[VERIFY OTP] key:', JSON.stringify(phone))

  // No OTP exists (expired or never sent)
  if (!storedCode) {
    throw createDomainError(ErrorCode.OTP_EXPIRED)
  }

  // Wrong code
  if (storedCode !== inputCode) {
    throw createDomainError(ErrorCode.OTP_INVALID)
  }

  // SUCCESS → invalidate immediately
  await deleteOtp(phone)

  return true
}
