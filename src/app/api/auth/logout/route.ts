import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST() {
  await requireAuthority('USER')
  try {
    // Clear the session cookie
    const cookieStore = await cookies()
    cookieStore.delete('session')

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logoout error:', error)
    return NextResponse.json(
      { success: false, message: 'Error logging out' },
      { status: 500 },
    )
  }
}
