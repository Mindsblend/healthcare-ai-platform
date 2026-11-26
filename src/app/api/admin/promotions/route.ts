import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { createPromotionCampaign } from '@/features/notifications/services/promotionCampaignService'

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
    const campaign = await createPromotionCampaign({
      adminId: session.id,
      title: input.title,
      body: input.body,
      url: input.url,
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message.includes('قبلاً ثبت')) {
      return NextResponse.json({ error: 'DUPLICATE_CAMPAIGN' }, { status: 409 })
    }
    console.error('[admin] create promotion failed', error)
    return NextResponse.json({ error: 'INTERNAL_ERROR' }, { status: 500 })
  }
}