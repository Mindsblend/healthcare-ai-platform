import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchCollectionBySlug } = vi.hoisted(() => ({
  fetchCollectionBySlug: vi.fn(),
}))

vi.mock('@/features/shop/services/CollectionService', () => ({
  CollectionService: {
    fetchCollectionBySlug,
  },
}))

import { GET } from '@/app/api/shop/collections/[slug]/route'

describe('GET /api/shop/collections/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a collection by slug', async () => {
    const collection = {
      id: 1,
      name: 'Daily Essentials',
      slug: 'daily-essentials',
    }
    fetchCollectionBySlug.mockResolvedValue(collection)

    const response = await GET(
      new Request(
        'http://localhost/api/shop/collections/daily-essentials',
      ) as never,
      { params: Promise.resolve({ slug: 'daily-essentials' }) },
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(collection)
    expect(fetchCollectionBySlug).toHaveBeenCalledWith('daily-essentials')
  })

  it('returns 404 when the collection does not exist', async () => {
    fetchCollectionBySlug.mockResolvedValue(null)

    const response = await GET(
      new Request('http://localhost/api/shop/collections/missing') as never,
      { params: Promise.resolve({ slug: 'missing' }) },
    )

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Collection not found',
    })
  })

  it('returns 500 when fetching the collection fails', async () => {
    fetchCollectionBySlug.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET(
      new Request(
        'http://localhost/api/shop/collections/daily-essentials',
      ) as never,
      { params: Promise.resolve({ slug: 'daily-essentials' }) },
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch collection',
    })
  })
})
