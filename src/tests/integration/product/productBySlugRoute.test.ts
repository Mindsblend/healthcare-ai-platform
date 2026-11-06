import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchProductBySlugMock } = vi.hoisted(() => ({
  fetchProductBySlugMock: vi.fn(),
}))

vi.mock('@/features/shop/services/ProductService', () => ({
  ProductService: {
    fetchProductBySlug: fetchProductBySlugMock,
  },
}))

import { GET } from '@/app/api/shop/products/[slug]/route'

function createParams(slug: string) {
  return { params: Promise.resolve({ slug }) }
}

describe('GET /api/shop/products/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the product for the requested slug', async () => {
    const product = {
      id: 'product-123',
      title: 'Test Product',
      slug: 'test-product',
      price: 100,
    }

    fetchProductBySlugMock.mockResolvedValue(product)

    const response = await GET(
      new Request(
        'http://localhost/api/shop/products/test-product',
      ) as Parameters<typeof GET>[0],
      createParams('test-product'),
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(product)
    expect(fetchProductBySlugMock).toHaveBeenCalledWith({
      slug: 'test-product',
    })
  })

  it('decodes the slug before calling the service', async () => {
    fetchProductBySlugMock.mockResolvedValue({
      id: 'product-456',
      slug: 'hand-woven rug',
    })

    const response = await GET(
      new Request(
        'http://localhost/api/shop/products/hand-woven%20rug',
      ) as Parameters<typeof GET>[0],
      createParams('hand-woven%20rug'),
    )

    expect(response.status).toBe(200)
    expect(fetchProductBySlugMock).toHaveBeenCalledWith({
      slug: 'hand-woven rug',
    })
  })

  it('returns 404 when the product does not exist', async () => {
    fetchProductBySlugMock.mockResolvedValue(null)

    const response = await GET(
      new Request(
        'http://localhost/api/shop/products/missing-product',
      ) as Parameters<typeof GET>[0],
      createParams('missing-product'),
    )

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Product not found',
    })
  })

  it('returns 500 when the service fails', async () => {
    fetchProductBySlugMock.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET(
      new Request(
        'http://localhost/api/shop/products/test-product',
      ) as Parameters<typeof GET>[0],
      createParams('test-product'),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch product',
    })
  })

  it('returns 500 when the slug has malformed percent-encoding', async () => {
    const response = await GET(
      new Request('http://localhost/api/shop/products/%E0%A4%A') as Parameters<
        typeof GET
      >[0],
      createParams('%E0%A4%A'),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch product',
    })
    expect(fetchProductBySlugMock).not.toHaveBeenCalled()
  })
})
