import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, deleteProductMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  deleteProductMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/ProductService', () => ({
  ProductService: {
    deleteProduct: deleteProductMock,
  },
}))

import { POST } from '@/app/api/shop/products/delete/route'

const makeRequest = (body: unknown) =>
  new Request('http://localhost/api/shop/products/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

describe('POST /api/shop/products/delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthorityMock.mockResolvedValue({
      id: 'admin-1',
      role: 'ADMIN',
    })
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('deletes a product when an admin provides a valid ID', async () => {
    const deletedProduct = { id: 1, title: 'Test Product' }
    deleteProductMock.mockResolvedValue(deletedProduct)

    const response = await POST(makeRequest({ id: 1 }))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct,
    })
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(deleteProductMock).toHaveBeenCalledWith({ id: 1 })
  })

  it('rejects unauthorized requests without deleting a product', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('UNAUTHORIZED'))

    const response = await POST(makeRequest({ id: 1 }))

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'UNAUTHORIZED',
    })
    expect(deleteProductMock).not.toHaveBeenCalled()
  })

  it('returns 400 when the product ID is missing', async () => {
    const response = await POST(makeRequest({}))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'Product ID is required. Received: {}',
    })
    expect(deleteProductMock).not.toHaveBeenCalled()
  })

  it('returns 400 when the product ID is null', async () => {
    const response = await POST(makeRequest({ id: null }))

    expect(response.status).toBe(400)
    expect(await response.json()).toMatchObject({
      error: expect.stringContaining('Product ID is required.'),
    })
    expect(deleteProductMock).not.toHaveBeenCalled()
  })

  it('returns 500 when the deletion service fails', async () => {
    deleteProductMock.mockRejectedValue(new Error('Database unavailable'))

    const response = await POST(makeRequest({ id: 1 }))

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Database unavailable',
    })
  })

  it('returns 500 when the request body is invalid JSON', async () => {
    const request = new Request('http://localhost/api/shop/products/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid json',
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(await response.json()).toMatchObject({
      error: expect.any(String),
    })
    expect(deleteProductMock).not.toHaveBeenCalled()
  })
})
