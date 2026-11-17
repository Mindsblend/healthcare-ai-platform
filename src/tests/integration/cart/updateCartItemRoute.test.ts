import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, updateItemQuantityMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  updateItemQuantityMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/CartService', () => ({
  CartService: {
    updateItemQuantity: updateItemQuantityMock,
  },
}))

import { POST } from '@/app/api/shop/cart/items/update/route'

function createRequest(body: unknown) {
  return new Request('http://localhost/api/shop/cart/items/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('POST /api/shop/cart/items/update', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })
  })

  it('updates an item and returns the service result', async () => {
    const updatedItem = {
      id: 10,
      cartId: 'cart-123',
      productId: 'product-456',
      quantity: 3,
    }

    updateItemQuantityMock.mockResolvedValue(updatedItem)

    const response = await POST(
      createRequest({
        cartItemId: 10,
        quantity: 3,
      }),
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(updatedItem)
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(updateItemQuantityMock).toHaveBeenCalledWith(
      {
        cartItemId: 10,
        quantity: 3,
      },
      'user-123',
    )
  })

  it('passes the exact cart item ID and quantity to the service', async () => {
    updateItemQuantityMock.mockResolvedValue({ id: 25, quantity: 5 })

    await POST(
      createRequest({
        cartItemId: 25,
        quantity: 5,
      }),
    )

    expect(updateItemQuantityMock).toHaveBeenCalledOnce()
    expect(updateItemQuantityMock).toHaveBeenCalledWith(
      {
        cartItemId: 25,
        quantity: 5,
      },
      'user-123',
    )
  })

  it('returns 500 when the service fails', async () => {
    updateItemQuantityMock.mockRejectedValue(
      new Error('Cart item could not be updated'),
    )

    const response = await POST(
      createRequest({
        cartItemId: 10,
        quantity: 2,
      }),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to update item',
    })
  })

  it('returns 500 when the request body contains invalid JSON', async () => {
    const request = new Request('http://localhost/api/shop/cart/items/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{invalid json',
    }) as Parameters<typeof POST>[0]

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to update item',
    })
    expect(updateItemQuantityMock).not.toHaveBeenCalled()
  })

  it('propagates authentication errors without calling the service', async () => {
    const authError = new Error('UNAUTHORIZED')
    requireAuthorityMock.mockRejectedValue(authError)

    await expect(
      POST(
        createRequest({
          cartItemId: 10,
          quantity: 2,
        }),
      ),
    ).rejects.toBe(authError)

    expect(updateItemQuantityMock).not.toHaveBeenCalled()
  })
})
