import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { fetchPreviewMock, fetchByCategoryMock, fetchBySlugMock } = vi.hoisted(
  () => ({
    fetchPreviewMock: vi.fn(),
    fetchByCategoryMock: vi.fn(),
    fetchBySlugMock: vi.fn(),
  }),
)

vi.mock('@/features/shop/services/ProductService', () => ({
  ProductService: {
    fetchProductsPreview: fetchPreviewMock,
    fetchProductsByCategoryId: fetchByCategoryMock,
    fetchProductBySlug: fetchBySlugMock,
  },
}))

import { GET as getProducts } from '@/app/api/shop/products/route'
import { GET as getProductBySlug } from '@/app/api/shop/products/[slug]/route'

describe('GET /api/shop/products', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns product previews when no categoryId is provided', async () => {
    const products = [{ id: 1, title: 'Persian Rug' }]
    fetchPreviewMock.mockResolvedValue(products)

    const request = new NextRequest('http://localhost/api/shop/products')

    const response = await getProducts(request)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(products)
    expect(response.headers.get('Cache-Control')).toBe(
      'public, s-maxage=300, stale-while-revalidate=600',
    )
    expect(fetchPreviewMock).toHaveBeenCalledOnce()
    expect(fetchByCategoryMock).not.toHaveBeenCalled()
  })

  it('filters products when categoryId is provided', async () => {
    const products = [{ id: 2, title: 'Face Cream' }]
    fetchByCategoryMock.mockResolvedValue(products)

    const request = new NextRequest(
      'http://localhost/api/shop/products?categoryId=2',
    )

    const response = await getProducts(request)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(products)
    expect(fetchByCategoryMock).toHaveBeenCalledWith({
      categoryId: 2,
    })
    expect(fetchPreviewMock).not.toHaveBeenCalled()
  })

  it('fetches all products when categoryId is empty', async () => {
    fetchPreviewMock.mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost/api/shop/products?categoryId=',
    )

    const response = await getProducts(request)

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual([])
    expect(fetchPreviewMock).toHaveBeenCalledOnce()
    expect(fetchByCategoryMock).not.toHaveBeenCalled()
  })

  it('returns 500 when fetching products fails', async () => {
    fetchPreviewMock.mockRejectedValue(new Error('Database unavailable'))

    const request = new NextRequest('http://localhost/api/shop/products')

    const response = await getProducts(request)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch products',
    })
  })

  it('passes an invalid categoryId to the service as NaN (current behavior)', async () => {
    fetchByCategoryMock.mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost/api/shop/products?categoryId=abc',
    )

    const response = await getProducts(request)

    expect(response.status).toBe(200)
    expect(fetchByCategoryMock).toHaveBeenCalledOnce()

    const input = fetchByCategoryMock.mock.calls[0][0]
    expect(Number.isNaN(input.categoryId)).toBe(true)
  })
})

describe('GET /api/shop/products/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a product when the slug exists', async () => {
    const product = { id: 1, title: 'Persian Rug', slug: 'persian-rug' }
    fetchBySlugMock.mockResolvedValue(product)

    const request = new NextRequest(
      'http://localhost/api/shop/products/persian-rug',
    )

    const response = await getProductBySlug(request, {
      params: Promise.resolve({ slug: 'persian-rug' }),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(product)
    expect(fetchBySlugMock).toHaveBeenCalledWith({
      slug: 'persian-rug',
    })
  })

  it('decodes the slug before fetching the product', async () => {
    const product = { id: 2, title: 'Persian Rug', slug: 'persian rug' }
    fetchBySlugMock.mockResolvedValue(product)

    const request = new NextRequest(
      'http://localhost/api/shop/products/persian%20rug',
    )

    const response = await getProductBySlug(request, {
      params: Promise.resolve({ slug: 'persian%20rug' }),
    })

    expect(response.status).toBe(200)
    expect(fetchBySlugMock).toHaveBeenCalledWith({
      slug: 'persian rug',
    })
  })

  it('returns 404 when the product does not exist', async () => {
    fetchBySlugMock.mockResolvedValue(null)

    const request = new NextRequest(
      'http://localhost/api/shop/products/missing-product',
    )

    const response = await getProductBySlug(request, {
      params: Promise.resolve({ slug: 'missing-product' }),
    })

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Product not found',
    })
  })

  it('returns 500 when the product service fails', async () => {
    fetchBySlugMock.mockRejectedValue(new Error('Database unavailable'))

    const request = new NextRequest(
      'http://localhost/api/shop/products/persian-rug',
    )

    const response = await getProductBySlug(request, {
      params: Promise.resolve({ slug: 'persian-rug' }),
    })

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch product',
    })
  })
})
