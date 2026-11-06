import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, removeItemMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  removeItemMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/CartService', () => ({
  CartService: {
    removeItem: removeItemMock,
  },
}))

import { POST } from '@/app/api/shop/cart/items/delete/route'

function createRequest(body: unknown) {
  return new Request('http://localhost/api/shop/cart/items/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('POST /api/shop/cart/items/delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })
  })

  it('deletes an item and returns the service result', async () => {
    const deletedItem = {
      id: 10,
      cartId: 'cart-123',
      productId: 'product-456',
      quantity: 2,
    }

    removeItemMock.mockResolvedValue(deletedItem)

    const response = await POST(createRequest({ cartItemId: 10 }))

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(deletedItem)
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(removeItemMock).toHaveBeenCalledWith({ cartItemId: 10 }, 'user-123')
  })

  it('passes the authenticated user ID to the service', async () => {
    removeItemMock.mockResolvedValue({ id: 25 })

    await POST(createRequest({ cartItemId: 25 }))

    expect(removeItemMock).toHaveBeenCalledOnce()
    expect(removeItemMock).toHaveBeenCalledWith({ cartItemId: 25 }, 'user-123')
  })

  it('returns 500 when the service fails', async () => {
    removeItemMock.mockRejectedValue(
      new Error('Cart item could not be deleted'),
    )

    const response = await POST(createRequest({ cartItemId: 10 }))

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to delete item',
    })
  })

  it('returns 500 when the request body contains invalid JSON', async () => {
    const request = new Request('http://localhost/api/shop/cart/items/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{invalid json',
    }) as Parameters<typeof POST>[0]

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to delete item',
    })
    expect(removeItemMock).not.toHaveBeenCalled()
  })

  it('propagates authentication errors without calling the service', async () => {
    const authError = new Error('UNAUTHORIZED')
    requireAuthorityMock.mockRejectedValue(authError)

    await expect(POST(createRequest({ cartItemId: 10 }))).rejects.toBe(
      authError,
    )

    expect(removeItemMock).not.toHaveBeenCalled()
  })
})
