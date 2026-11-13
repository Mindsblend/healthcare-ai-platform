import {
  getOtp,
  deleteOtp,
  OTP_VERIFICATION_ATTEMPT_LIMIT,
  registerOtpVerificationAttempt,
} from './lifeCycleOtpService'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { VerifyOtpInput, VerifyOtpResponse } from '../auth.types'

export async function verifyOtp(
  input: VerifyOtpInput,
): Promise<VerifyOtpResponse> {
  const { identifier, code } = input

  if (typeof code !== 'string' || code.length !== 6 || !/^\d{6}$/.test(code)) {
    throw createDomainError(ErrorCode.OTP_INVALID)
  }

  const storedCode = await getOtp(identifier)

  if (!storedCode) {
    throw createDomainError(ErrorCode.OTP_EXPIRED)
  }

  if (storedCode !== code) {
    const attempts = await registerOtpVerificationAttempt(identifier)
    if (attempts >= OTP_VERIFICATION_ATTEMPT_LIMIT) {
      await deleteOtp(identifier)
      throw createDomainError(ErrorCode.OTP_TOO_MANY_ATTEMPTS)
    }

    throw createDomainError(ErrorCode.OTP_INVALID)
  }

  await deleteOtp(identifier)

  return { success: true }
}
