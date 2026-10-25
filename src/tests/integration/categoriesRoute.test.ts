import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchPreviewCategories } = vi.hoisted(() => ({
  fetchPreviewCategories: vi.fn(),
}))

vi.mock('@/features/shop/services/CategoryService', () => ({
  CategoryService: {
    fetchPreviewCategories,
  },
}))

import { GET } from '@/app/api/shop/categories/route'

describe('GET /api/shop/categories', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns preview categories with the public cache header', async () => {
    const categories = [
      { id: 1, name: 'Skincare', slug: 'skincare' },
      { id: 2, name: 'Nutrition', slug: 'nutrition' },
    ]
    fetchPreviewCategories.mockResolvedValue(categories)

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(categories)
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=300, stale-while-revalidate=600',
    )
    expect(fetchPreviewCategories).toHaveBeenCalledOnce()
  })

  it('returns 500 when fetching categories fails', async () => {
    fetchPreviewCategories.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET()

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch categories',
    })
  })
})
