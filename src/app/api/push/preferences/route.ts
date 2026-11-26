import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { getNotificationPreferences, updateNotificationPreferences } from '@/features/notifications/services/pushSubscriptionService'

export async function GET() {
  let session
  try {
    session = await requireAuthority({ requiredRole: 'USER' })
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  try {
    const prefs = await getNotificationPreferences(session.id)
    return NextResponse.json(prefs)
  } catch (error) {
    console.error('[push] get preferences failed', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  let session
  try {
    session = await requireAuthority({ requiredRole: 'USER' })
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  const input = body as { orderUpdates?: boolean; promotions?: boolean }

  if (
    typeof input.orderUpdates !== 'boolean' &&
    typeof input.promotions !== 'boolean'
  ) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  try {
    const prefs = await updateNotificationPreferences(session.id, input)
    return NextResponse.json(prefs)
  } catch (error) {
    console.error('[push] update preferences failed', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}