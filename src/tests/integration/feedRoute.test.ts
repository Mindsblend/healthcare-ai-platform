import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchFeedCategories } = vi.hoisted(() => ({
  fetchFeedCategories: vi.fn(),
}))

vi.mock('@/features/shop/services/FeedService', () => ({
  FeedService: {
    fetchFeedCategories,
  },
}))

import { GET } from '@/app/api/shop/feed/route'

describe('GET /api/shop/feed', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns feed categories', async () => {
    const categories = [
      { id: 1, name: 'Skincare', slug: 'skincare' },
      { id: 2, name: 'Nutrition', slug: 'nutrition' },
    ]
    fetchFeedCategories.mockResolvedValue(categories)

    const response = await GET(
      new Request('http://localhost/api/shop/feed') as never,
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(categories)
    expect(fetchFeedCategories).toHaveBeenCalledWith({})
    expect(fetchFeedCategories).toHaveBeenCalledOnce()
  })

  it('returns 500 when fetching feed categories fails', async () => {
    fetchFeedCategories.mockRejectedValue(
      new Error('Database unavailable'),
    )

    const response = await GET(
      new Request('http://localhost/api/shop/feed') as never,
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch feed categories',
    })
  })
})
