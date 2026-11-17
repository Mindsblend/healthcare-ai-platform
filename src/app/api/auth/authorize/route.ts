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
    const body: unknown = await req.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw createDomainError(ErrorCode.INVALID_INPUT)
    }

    const { identifier, code } = body as {
      identifier?: unknown
      code?: unknown
    }
    if (typeof identifier !== 'string') {
      throw createDomainError(ErrorCode.MISSING_IDENTIFIER)
    }
    if (typeof code !== 'string') {
      throw createDomainError(ErrorCode.OTP_INVALID)
    }

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
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json(
      { error: createDomainError(ErrorCode.UNKNOWN) },
      { status: 500 },
    )
  }
}
