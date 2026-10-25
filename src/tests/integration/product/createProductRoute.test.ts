import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, createProductMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  createProductMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/ProductService', () => ({
  ProductService: {
    createProduct: createProductMock,
  },
}))

import { Prisma } from '@/generated/prisma/client'
import { POST } from '@/app/api/shop/products/create/route'

const validProductInput = {
  title: 'Test Product',
  price: 100,
  slug: 'test-product',
}

const makeRequest = (body: unknown = validProductInput) =>
  new Request('http://localhost/api/shop/products/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('POST /api/shop/products/create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a product when the caller has ADMIN authority', async () => {
    const product = {
      id: 1,
      title: 'Test Product',
      slug: 'test-product',
    }

    requireAuthorityMock.mockResolvedValue({
      id: 'admin-1',
      role: 'ADMIN',
    })
    createProductMock.mockResolvedValue(product)

    const response = await POST(makeRequest())
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body).toEqual(product)
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(createProductMock).toHaveBeenCalledWith(validProductInput)
  })

  it('does not create a product when authorization fails', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('UNAUTHORIZED'))

    const response = await POST(makeRequest())
    const body = await response.json()

    // Documents current behavior: the route maps this error to HTTP 500.
    expect(response.status).toBe(500)
    expect(body.error.code).toBe('CREATE_PRODUCT_FAILED')
    expect(body.error.message).toBe('UNAUTHORIZED')
    expect(createProductMock).not.toHaveBeenCalled()
  })

  it('returns 409 when Prisma reports a duplicate constraint', async () => {
    requireAuthorityMock.mockResolvedValue({
      id: 'admin-1',
      role: 'ADMIN',
    })

    createProductMock.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    )

    const response = await POST(makeRequest())
    const body = await response.json()

    expect(response.status).toBe(409)
    expect(body.error.code).toBe('SLUG_ALREADY_EXISTS')
    expect(createProductMock).toHaveBeenCalledOnce()
  })

  it('returns 500 when product creation fails unexpectedly', async () => {
    requireAuthorityMock.mockResolvedValue({
      id: 'admin-1',
      role: 'ADMIN',
    })
    createProductMock.mockRejectedValue(new Error('Database unavailable'))

    const response = await POST(makeRequest())
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error.code).toBe('CREATE_PRODUCT_FAILED')
    expect(body.error.message).toBe('Database unavailable')
  })

  it('returns 500 when the request body is invalid JSON', async () => {
    requireAuthorityMock.mockResolvedValue({
      id: 'admin-1',
      role: 'ADMIN',
    })

    const request = new Request('http://localhost/api/shop/products/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json',
    })

    const response = await POST(request)
    const body = await response.json()

    expect(response.status).toBe(500)
    expect(body.error.code).toBe('CREATE_PRODUCT_FAILED')
    expect(createProductMock).not.toHaveBeenCalled()
  })
})
