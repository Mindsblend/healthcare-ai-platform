import { getOtp, deleteOtp } from './lifeCycleOtpService'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { VerifyOtpInput, VerifyOtpResponse } from '../auth.types'

export async function verifyOtp(
  input: VerifyOtpInput,
): Promise<VerifyOtpResponse> {
  const { identifier, code } = input

  if (!code) throw createDomainError(ErrorCode.OTP_INVALID)

  const storedCode = await getOtp(identifier)

  console.log('[VERIFY OTP] key:', JSON.stringify(identifier))

  if (!storedCode) {
    throw createDomainError(ErrorCode.OTP_EXPIRED)
  }

  if (storedCode !== code) {
    throw createDomainError(ErrorCode.OTP_INVALID)
  }

  await deleteOtp(identifier)

  return { success: true }
}
