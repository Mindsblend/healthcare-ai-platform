import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchAllCollections } = vi.hoisted(() => ({
  fetchAllCollections: vi.fn(),
}))

vi.mock('@/features/shop/services/CollectionService', () => ({
  CollectionService: {
    fetchAllCollections,
  },
}))

import { GET } from '@/app/api/shop/collections/route'

describe('GET /api/shop/collections', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns all collections', async () => {
    const collections = [
      { id: 1, name: 'Daily Essentials', slug: 'daily-essentials' },
      { id: 2, name: 'Best Sellers', slug: 'best-sellers' },
    ]
    fetchAllCollections.mockResolvedValue(collections)

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(collections)
    expect(fetchAllCollections).toHaveBeenCalledOnce()
  })

  it('returns an error and diagnostic details when fetching fails', async () => {
    fetchAllCollections.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET()

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch collections',
      details: 'Database unavailable',
    })
  })
})
