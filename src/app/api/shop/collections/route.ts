import { NextResponse } from 'next/server'
import { CollectionService } from '@/features/shop/services/CollectionService'

export async function GET() {
  try {
    console.log('[Collections API] Request received')

    const collections = await CollectionService.fetchAllCollections()

    console.log('[Collections API] Raw collections from service:', {
      count: collections?.length,
      sample: collections?.[0],
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error('[Collections API] FAILED:', error)

    return NextResponse.json(
      {
        error: 'Failed to fetch collections',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
