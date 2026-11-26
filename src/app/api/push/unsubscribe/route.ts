import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { validateUnsubscribeInput } from '@/features/notifications/services/pushValidation'
import { removePushSubscription } from '@/features/notifications/services/pushSubscriptionService'

export async function POST(req: NextRequest) {
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

  const subscription = validateUnsubscribeInput(body)

  if (!subscription) {
    return NextResponse.json({ error: 'INVALID_SUBSCRIPTION' }, { status: 400 })
  }

  try {
    const count = await removePushSubscription({
      userId: session.id,
      endpoint: subscription.endpoint,
    })

    return NextResponse.json({ success: true, removed: count > 0 })
  } catch (error) {
    console.error('[push] unsubscribe failed', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}