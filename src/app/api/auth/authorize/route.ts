import { NextResponse } from 'next/server'
import { authorize } from '@/features/auth/services/databaseService'
import { verifyOtp } from '@/features/auth/services/verifyOtpService'
import { createJwtSession } from '@/features/auth/services/sessionService'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  try {
    const { identifier, code } = await req.json()

    if (!identifier || !code) {
      return Response.json(
        { error: 'Identifier and code are required' },
        { status: 400 },
      )
    }

    // Verify the user otp
    await verifyOtp(identifier, code)
    console.log("OTP code verified")

    // Create the user in the database if it's new.
    // If not log in
    const user = await authorize(identifier)
    console.log("User created in the database")

    // Create the user session and log in
    const token = createJwtSession(user)
    console.log("User logged in and session created")

    // Set the cookie
    const cookieStore = await cookies()

    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return NextResponse.json({ success: true, redirect: '/' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid or expired OTP' },
      { status: 400 },
    )
  }
}
