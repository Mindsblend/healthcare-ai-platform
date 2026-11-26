import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { prisma } from '@/lib/prisma'

export async function POST() {
  const cookieStore = await cookies()

  try {
    let session
    try {
      session = await requireAuthority({ requiredRole: 'USER' })
    } catch {
      // No valid session: still clear the cookie so logout is idempotent.
      cookieStore.delete('session')
      return NextResponse.json({
        success: true,
        message: 'Logged out successfully',
      })
    }

    // Delete all push subscriptions for this user to prevent
    // a shared device from receiving previous user's notifications.
    // Best-effort: a failure here must not block logout.
    try {
      await prisma.pushSubscription.deleteMany({
        where: { userId: session.id },
      })
    } catch (error) {
      console.error('Logout: failed to delete push subscriptions:', error)
    }

    // Clear the session cookie
    cookieStore.delete('session')

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    // Ensure the cookie is cleared even on unexpected failures.
    cookieStore.delete('session')
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  }
}