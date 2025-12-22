import { getOtp, deleteOtp } from './lifeCycleOtpService'
import { createDomainError, ErrorCode } from '@/lib/errors'

export async function verifyOtp(identifier: string, inputCode: string) {
  // Validate arguments
  if (!inputCode) throw createDomainError(ErrorCode.OTP_INVALID)

  const storedCode = await getOtp(identifier)

  console.log('[VERIFY OTP] key:', JSON.stringify(identifier))

  // No OTP exists (expired or never sent)
  if (!storedCode) {
    throw createDomainError(ErrorCode.OTP_EXPIRED)
  }

  // Wrong code
  if (storedCode !== inputCode) {
    throw createDomainError(ErrorCode.OTP_INVALID)
  }

  // SUCCESS → invalidate immediately
  await deleteOtp(identifier)

  return true
}
