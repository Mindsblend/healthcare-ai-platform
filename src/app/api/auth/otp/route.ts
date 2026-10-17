import { NextResponse } from 'next/server'
import { sendOtpViaSms } from '@/features/auth/services/sendSmsOtpService'
import { saveOtp } from '@/features/auth/services/lifeCycleOtpService'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { validateAuthenticationIdentifier } from '@/lib/helpers'
import { sendOtpViaEmail } from '@/features/auth/services/sendEmailOtpService'

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json()
    const { type, value } = await validateAuthenticationIdentifier(identifier)

    let code: string

    switch (type) {
      case 'email':
        // Send OTP
        code = await sendOtpViaEmail(value)

        // Store OTP
        await saveOtp(value, code)
        break

      case 'phone':
        // Send OTP
        const smsResponse = await sendOtpViaSms({ phone: value })
        code = smsResponse.code

        // Store OTP
        await saveOtp(value, code)
        break

      default:
        // This should never happen if validateAuthenticationIdentifier is robust
        return NextResponse.json(
          { error: createDomainError(ErrorCode.UNKNOWN_IDENTIFIER) },
          { status: 400 },
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      'message' in error
    ) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json(
      { error: createDomainError(ErrorCode.UNKNOWN) },
      { status: 500 },
    )
  }
}
