import { NextResponse } from 'next/server'
import { sendOtpViaSms } from '@/features/auth/services/sendSmsOtpService'
import {
  checkOtpRateLimit,
  saveOtp,
} from '@/features/auth/services/lifeCycleOtpService'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { validateAuthenticationIdentifier } from '@/lib/helpers'
import { sendOtpViaEmail } from '@/features/auth/services/sendEmailOtpService'

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw createDomainError(ErrorCode.INVALID_INPUT)
    }

    const { identifier } = body as { identifier?: unknown }
    if (typeof identifier !== 'string') {
      throw createDomainError(ErrorCode.MISSING_IDENTIFIER)
    }

    const { type, value } = await validateAuthenticationIdentifier(identifier)
    await checkOtpRateLimit(value)

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
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: createDomainError(ErrorCode.INVALID_INPUT) },
        { status: 400 },
      )
    }

    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      'message' in error
    ) {
      const status =
        error.code === ErrorCode.EMAIL_PROVIDER_FAILED.code ? 502 : 400
      return NextResponse.json({ error }, { status })
    }

    return NextResponse.json(
      { error: createDomainError(ErrorCode.UNKNOWN) },
      { status: 500 },
    )
  }
}
