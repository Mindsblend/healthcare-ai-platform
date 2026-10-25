import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/dashboard/products/route'

const { fetchProductsPreview } = vi.hoisted(() => ({
  fetchProductsPreview: vi.fn(),
}))

vi.mock('@/features/shop/services/ProductService', () => ({
  ProductService: {
    fetchProductsPreview,
  },
}))

describe('GET /api/dashboard/products', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the product preview list', async () => {
    const products = [
      { id: 'product-1', title: 'Product One' },
      { id: 'product-2', title: 'Product Two' },
    ]
    fetchProductsPreview.mockResolvedValue(products)

    const response = await GET()

    expect(fetchProductsPreview).toHaveBeenCalledOnce()
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(products)
  })

  it('returns 500 when fetching product previews fails', async () => {
    fetchProductsPreview.mockRejectedValue(
      new Error('Database unavailable'),
    )

    const response = await GET()

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to fetch products',
    })
  })
})