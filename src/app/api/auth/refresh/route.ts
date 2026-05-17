import { NextResponse } from 'next/server'
import { refreshSessionIfNeeded } from '@/features/auth/services/sessionService'

export async function POST() {
  try {
    await refreshSessionIfNeeded()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Session refresh error:', error)
    return NextResponse.json(
      { error: 'Failed to refresh session' },
      { status: 500 },
    )
  }
}
