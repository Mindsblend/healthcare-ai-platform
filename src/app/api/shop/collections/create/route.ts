import { requireAuthority } from '@/features/auth/services/sessionService'
import { NextResponse } from 'next/server'
import { CollectionService } from '@/features/shop/services/CollectionService'

export async function POST(req: Request) {
  try {
    await requireAuthority({ requiredRole: 'ADMIN' })
    const body = await req.json()
    const collection = await CollectionService.createCollection(body)
    return NextResponse.json(collection)
  } catch (error) {
    console.error('CREATE COLLECTION ERROR:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
