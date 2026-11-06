import { NextResponse } from 'next/server'
import { verifyOtp } from '@/features/auth/services/verifyOtpService'
import { UserService } from '@/features/shop/services/UserService'

import {
  createJwtSession,
  setSessionCookie,
} from '@/features/auth/services/sessionService'
import { createDomainError, ErrorCode } from '@/lib/errors'
import { validateAuthenticationIdentifier } from '@/lib/helpers'

export async function POST(req: Request) {
  try {
    const { identifier, code } = await req.json()
    const { type, value } = await validateAuthenticationIdentifier(identifier)

    let user
    let token

    switch (type) {
      case 'email':
        await verifyOtp({ identifier: value, code })

        user = await UserService.createUser(value, type)

        token = createJwtSession(user)

        await setSessionCookie(token)
        break

      case 'phone':
        await verifyOtp({ identifier: value, code })

        user = await UserService.createUser(value, type)

        token = createJwtSession(user)

        await setSessionCookie(token)
        break

      default:
        // This should never happen if validateAuthenticationIdentifier is robust
        return NextResponse.json(
          { error: createDomainError(ErrorCode.UNKNOWN_IDENTIFIER) },
          { status: 400 },
        )
    }

    return NextResponse.json({
      success: true,
      redirect: '/',
    })
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
