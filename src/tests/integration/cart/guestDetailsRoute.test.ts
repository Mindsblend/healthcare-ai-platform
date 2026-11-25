import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { productFindManyMock } = vi.hoisted(() => ({
  productFindManyMock: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: productFindManyMock,
    },
  },
}))

import { POST } from '@/app/api/cart/guest-details/route'

function createRequest(body: unknown) {
  return new NextRequest('http://localhost/api/cart/guest-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/cart/guest-details', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns product details for valid product IDs', async () => {
    const products = [
      {
        id: 1,
        title: 'محصول تست',
        price: 100000,
        discount: null,
        discountedPrice: null,
        solution: 'تست',
        slug: 'test-product',
        image: '/test.jpg',
        categoryId: 1,
        category: { name: 'تست', iconPath: '/icon.svg' },
      },
    ]

    productFindManyMock.mockResolvedValue(products)

    const response = await POST(createRequest({ productIds: [1] }))

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.products).toEqual(products)
    expect(productFindManyMock).toHaveBeenCalledWith({
      where: { id: { in: [1] }, isActive: true },
      select: expect.any(Object),
    })
  })

  it('returns empty products array for valid but no matching products', async () => {
    productFindManyMock.mockResolvedValue([])

    const response = await POST(createRequest({ productIds: [999] }))

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.products).toEqual([])
  })

  it('returns 400 for invalid productIds (empty array)', async () => {
    const response = await POST(createRequest({ productIds: [] }))

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('ورودی نامعتبر است')
  })

  it('returns 400 for missing productIds', async () => {
    const response = await POST(createRequest({}))

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('ورودی نامعتبر است')
  })

  it('returns 400 for negative productId', async () => {
    const response = await POST(createRequest({ productIds: [-1] }))

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('ورودی نامعتبر است')
  })

  it('returns 400 for non-integer productId', async () => {
    const response = await POST(createRequest({ productIds: [1.5] }))

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('ورودی نامعتبر است')
  })

  it('returns 400 when productIds is not an array', async () => {
    const response = await POST(createRequest({ productIds: 'not-an-array' }))

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('ورودی نامعتبر است')
  })

  it('returns 500 on database error', async () => {
    productFindManyMock.mockRejectedValue(new Error('DB connection failed'))

    const response = await POST(createRequest({ productIds: [1] }))

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('خطا در دریافت اطلاعات محصولات')
  })

  it('limits productIds to maximum 100 items', async () => {
    const tooManyIds = Array.from({ length: 101 }, (_, i) => i + 1)
    const response = await POST(createRequest({ productIds: tooManyIds }))

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe('ورودی نامعتبر است')
  })
})
