import { NextRequest, NextResponse } from 'next/server'
import { FeedService } from '@/features/shop/services/FeedService'

export async function GET(request: NextRequest) {
  try {
    const feedCategories = await FeedService.fetchFeedCategories({})
    return NextResponse.json(feedCategories)
  } catch (error) {
    console.error('Error fetching feed categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch feed categories' },
      { status: 500 },
    )
  }
}
