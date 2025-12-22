import { NextResponse } from 'next/server'
import { sendOtpViaSms } from '@/features/auth/services/sendSmsOtpService'
import { saveOtp } from '@/features/auth/services/lifeCycleOtpService'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { validateIdentifier } from '@/lib/helpers'
import { sendOtpViaEmail } from '@/features/auth/services/sendEmailOtpService'

export async function POST(req: Request) {
  try {
    const { identifier } = await req.json()
    const { type, value } = await validateIdentifier(identifier)

    let code: string

    switch (type) {
      case 'email':
        console.log(`[EMAIL] OTP request for: ${value}`)

        // Send OTP
        code = await sendOtpViaEmail(value)
        console.log('[EMAIL] OTP code sent')

        // Store OTP
        await saveOtp(value, code)
        console.log('[EMAIL] OTP code saved')
        break

      case 'phone':
        console.log(`[SMS] OTP request for: ${value}`)

        // Send OTP
        code = await sendOtpViaSms(value)
        console.log('[SMS] OTP code sent')

        // Store OTP
        await saveOtp(value, code)
        console.log('[SMS] OTP code saved')
        break

      default:
        // This should never happen if validateIdentifier is robust
        return NextResponse.json(
          { error: createDomainError(ErrorCode.UNKNOWN_IDENTIFIER) },
          { status: 400 },
        )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[OTP API] Caught error:', error)

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
