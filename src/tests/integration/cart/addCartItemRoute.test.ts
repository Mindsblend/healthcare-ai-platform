import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, addItemMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  addItemMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/CartService', () => ({
  CartService: {
    addItem: addItemMock,
  },
}))

import { POST } from '@/app/api/shop/cart/items/add/route'

function createRequest(body: unknown) {
  return new Request('http://localhost/api/cart/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }) as Parameters<typeof POST>[0]
}

describe('POST /api/cart/items', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })
  })

  it('adds an item and returns the service result', async () => {
    const item = {
      id: 10,
      cartId: 'cart-123',
      productId: 'product-456',
      quantity: 2,
    }

    addItemMock.mockResolvedValue(item)

    const response = await POST(
      createRequest({
        cartId: 'cart-123',
        productId: 'product-456',
        quantity: 2,
      }),
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(item)
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(addItemMock).toHaveBeenCalledWith(
      {
        cartId: 'cart-123',
        productId: 'product-456',
        quantity: 2,
      },
      'user-123',
    )
  })

  it('passes the authenticated user ID to the service', async () => {
    addItemMock.mockResolvedValue({ id: 10 })

    await POST(
      createRequest({
        cartId: 'cart-123',
        productId: 'product-456',
        quantity: 1,
      }),
    )

    expect(addItemMock).toHaveBeenCalledWith(expect.any(Object), 'user-123')
  })

  it('returns 500 when the service fails', async () => {
    addItemMock.mockRejectedValue(new Error('Cart item could not be added'))

    const response = await POST(
      createRequest({
        cartId: 'cart-123',
        productId: 'product-456',
        quantity: 1,
      }),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to add item',
    })
  })

  it('propagates authentication errors without calling the service', async () => {
    const authError = new Error('UNAUTHORIZED')
    requireAuthorityMock.mockRejectedValue(authError)

    await expect(
      POST(
        createRequest({
          cartId: 'cart-123',
          productId: 'product-456',
          quantity: 1,
        }),
      ),
    ).rejects.toBe(authError)

    expect(addItemMock).not.toHaveBeenCalled()
  })
})
