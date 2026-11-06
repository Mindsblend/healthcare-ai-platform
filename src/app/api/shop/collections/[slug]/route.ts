// app/api/shop/collections/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { CollectionService } from '@/features/shop/services/CollectionService'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    // Await the params Promise
    const { slug } = await params

    const collection = await CollectionService.fetchCollectionBySlug(slug)

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 },
      )
    }
    return NextResponse.json(collection)
  } catch (error) {
    console.error('API route - Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch collection' },
      { status: 500 },
    )
  }
}
