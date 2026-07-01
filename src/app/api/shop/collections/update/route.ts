import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { CollectionService } from '@/features/shop/services/CollectionService'

export async function PUT(req: NextRequest) {
  try {
    await requireAuthority({ requiredRole: 'ADMIN' })
    const body = await req.json()
    const collection = await CollectionService.updateCollection({
      id: body.id,
      ...body,
    })
    return NextResponse.json(collection)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update collection' },
      { status: 500 },
    )
  }
}
