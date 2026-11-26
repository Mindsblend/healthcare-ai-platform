import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { sendPromotionTestToSelf } from '@/features/notifications/services/promotionCampaignService'

export async function POST(req: NextRequest) {
  let session
  try {
    session = await requireAuthority({ requiredRole: 'ADMIN' })
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 })
  }

  const input = body as { title: string; body: string; url: string }

  if (!input.title || !input.body || !input.url) {
    return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 })
  }

  if (input.title.length > 80 || input.body.length > 240 || input.url.length > 512) {
    return NextResponse.json({ error: 'FIELD_TOO_LONG' }, { status: 400 })
  }

  if (!input.url.startsWith('/')) {
    return NextResponse.json({ error: 'INVALID_URL' }, { status: 400 })
  }

  try {
    const result = await sendPromotionTestToSelf({
      userId: session.id,
      title: input.title,
      body: input.body,
      url: input.url,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('[admin] test promotion failed', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}