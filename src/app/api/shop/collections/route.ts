import { NextResponse } from 'next/server'
import { CollectionService } from '@/features/shop/services/CollectionService'

export async function GET() {
  try {
    const collections = await CollectionService.fetchAllCollections()

    return NextResponse.json(collections)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch collections',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
