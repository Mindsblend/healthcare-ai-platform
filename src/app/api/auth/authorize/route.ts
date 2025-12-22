import { NextResponse } from 'next/server'
import { verifyOtp } from '@/features/auth/services/verifyOtpService'
import { authorize } from '@/features/auth/services/databaseService'
import { createJwtSession } from '@/features/auth/services/sessionService'
import { cookies } from 'next/headers'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { validateIdentifier } from '@/lib/helpers'

export async function POST(req: Request) {
  try {
    const { identifier, code } = await req.json()
    const { type, value } = await validateIdentifier(identifier)

    switch (type) {
      case 'email':
        // TODO: implement email OTP flow if needed
        console.log(`[EMAIL] OTP request for: ${value}`)
        // Example: await sendOtpViaEmail(value)
        break

      case 'phone':
        await verifyOtp(value, code)
        console.log('[SMS] OTP verified successfully')

        const user = await authorize(value, type)
        console.log('[SMS] User fetched/created')

        const token = createJwtSession(user)
        console.log('[SMS] Session created')

        const cookieStore = await cookies()
        cookieStore.set('session', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        })
        break

      default:
        // This should never happen if validateIdentifier is robust
        return NextResponse.json(
          { error: createDomainError(ErrorCode.UNKNOWN_IDENTIFIER) },
          { status: 400 },
        )
    }

    return NextResponse.json({ success: true, redirect: '/' })
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
