import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { requireAuthorityMock, updateProductMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  updateProductMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/ProductService', () => ({
  ProductService: {
    updateProduct: updateProductMock,
  },
}))

import { POST } from '@/app/api/shop/products/update/route'

const makeRequest = (body: unknown) =>
  new NextRequest('http://localhost/api/shop/products/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('POST /api/shop/products/update', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthorityMock.mockResolvedValue({
      id: 'admin-1',
      role: 'ADMIN',
    })
  })

  it('updates a product when an admin submits valid fields', async () => {
    const updatedProduct = {
      id: 1,
      title: 'Updated Product',
      price: 150,
    }

    updateProductMock.mockResolvedValue(updatedProduct)

    const response = await POST(
      makeRequest({ id: 1, title: 'Updated Product', price: 150 }),
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(updatedProduct)
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(updateProductMock).toHaveBeenCalledWith({
      id: 1,
      title: 'Updated Product',
      price: 150,
    })
  })

  it('returns 400 when id is missing', async () => {
    const response = await POST(makeRequest({ title: 'Updated Product' }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: 'id is required' })
    expect(requireAuthorityMock).not.toHaveBeenCalled()
    expect(updateProductMock).not.toHaveBeenCalled()
  })

  it('rejects unauthorized requests without calling the service', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('UNAUTHORIZED'))

    const response = await POST(
      makeRequest({ id: 1, title: 'Updated Product' }),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toMatchObject({
      error: 'Internal server error',
    })
    expect(updateProductMock).not.toHaveBeenCalled()
  })

  it('returns 400 when no updatable fields are provided', async () => {
    const response = await POST(makeRequest({ id: 1 }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'No valid updates provided',
    })
    expect(requireAuthorityMock).toHaveBeenCalledOnce()
    expect(updateProductMock).not.toHaveBeenCalled()
  })

  it('only forwards fields explicitly provided in the request', async () => {
    updateProductMock.mockResolvedValue({
      id: 1,
      description: 'Updated description',
    })

    await POST(
      makeRequest({
        id: 1,
        description: 'Updated description',
        ignoredField: 'should not be forwarded',
        isActive: false,
      }),
    )

    expect(updateProductMock).toHaveBeenCalledWith({
      id: 1,
      description: 'Updated description',
    })
  })

  it('preserves explicitly provided null values', async () => {
    updateProductMock.mockResolvedValue({
      id: 1,
      feedCategoryId: null,
    })

    const response = await POST(makeRequest({ id: 1, feedCategoryId: null }))

    expect(response.status).toBe(200)
    expect(updateProductMock).toHaveBeenCalledWith({
      id: 1,
      feedCategoryId: null,
    })
  })

  it('returns 500 when the update service fails', async () => {
    updateProductMock.mockRejectedValue(new Error('Database unavailable'))

    const response = await POST(
      makeRequest({ id: 1, title: 'Updated Product' }),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toMatchObject({
      error: 'Internal server error',
      details: 'Error: Database unavailable',
    })
  })

  it('returns 500 when the request body is invalid JSON', async () => {
    const request = new NextRequest(
      'http://localhost/api/shop/products/update',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json',
      },
    )

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(await response.json()).toMatchObject({
      error: 'Internal server error',
    })
    expect(updateProductMock).not.toHaveBeenCalled()
  })
})
