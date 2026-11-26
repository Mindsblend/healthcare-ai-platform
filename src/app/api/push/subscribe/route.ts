import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { validatePushSubscriptionInput } from '@/features/notifications/services/pushValidation'
import { savePushSubscription } from '@/features/notifications/services/pushSubscriptionService'

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

  const subscription = validatePushSubscriptionInput(body)

  if (!subscription) {
    return NextResponse.json({ error: 'INVALID_SUBSCRIPTION' }, { status: 400 })
  }

  try {
    await savePushSubscription({
      userId: session.id,
      subscription,
      userAgent: req.headers.get('user-agent'),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[push] subscribe failed', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}
