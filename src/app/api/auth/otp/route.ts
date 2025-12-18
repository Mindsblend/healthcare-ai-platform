import { NextResponse } from 'next/server'
import { sendOtpViaSms } from '@/features/auth/services/sendOtpService'
import { saveOtp } from '@/features/auth/services/storeOtpService'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { validateIdentifier } from '@/lib/helpers'


export async function POST(req: Request) {
  try {
    const { identifier } = await req.json()
    const { type, value } = await validateIdentifier(identifier)

    switch (type) {
      case 'email':
        // TODO: implement email OTP flow if needed
        console.log(`[EMAIL] OTP request for: ${value}`)
        // Example: await sendOtpViaEmail(value)
        break

      case 'phone':
        console.log(`[SMS] OTP request for: ${value}`)

        // Send OTP
        const { code } = await sendOtpViaSms(value)
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
