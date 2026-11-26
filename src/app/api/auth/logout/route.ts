import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { prisma } from '@/lib/prisma'

export async function POST() {
  let session
  try {
    session = await requireAuthority({ requiredRole: 'USER' })
  } catch {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Delete all push subscriptions for this user to prevent
    // a shared device from receiving previous user's notifications
    await prisma.pushSubscription.deleteMany({
      where: { userId: session.id },
    })

    // Clear the session cookie
    const cookieStore = await cookies()
    cookieStore.delete('session')

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Error logging out' },
      { status: 500 },
    )
  }
}