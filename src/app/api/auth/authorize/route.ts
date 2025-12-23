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

    let user
    let token
    let cookieStore

    switch (type) {
      case 'email':
        await verifyOtp(value, code)
        console.log('[SMS] OTP verified successfully')

        user = await authorize(value, type)
        console.log('[SMS] User fetched/created')

        token = createJwtSession(user)
        console.log('[SMS] Session created')

        cookieStore = await cookies()
        cookieStore.set('session', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'lax',
          path: '/',
        })
        break

      case 'phone':
        await verifyOtp(value, code)
        console.log('[SMS] OTP verified successfully')

        user = await authorize(value, type)
        console.log('[SMS] User fetched/created')

        token = createJwtSession(user)
        console.log('[SMS] Session created')

        cookieStore = await cookies()
        cookieStore.set('session', token, {
          httpOnly: true,
          secure: false,
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
