import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { updateItemQuantity } from '@/features/shop/actions/cart/updateItemAction'

describe('updateItemQuantity', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should update cart item successfully', async () => {
    const responseData = {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 3,
      price: 100000,
    }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await updateItemQuantity({
      cartItemId: 'item-1',
      quantity: 3,
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/shop/cart/items/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItemId: 'item-1',
        quantity: 3,
      }),
    })

    expect(result).toEqual(responseData)
  })

  it('should throw error when API request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'Failed to update item',
        }),
        {
          status: 500,
        },
      ),
    )

    await expect(
      updateItemQuantity({
        cartItemId: 'item-1',
        quantity: 3,
      }),
    ).rejects.toThrow('Failed to update item')
  })

  it('should send quantity zero when removing item through quantity update', async () => {
    const responseData = {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 0,
      price: 100000,
    }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseData), {
        status: 200,
      }),
    )

    const result = await updateItemQuantity({
      cartItemId: 'item-1',
      quantity: 0,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/cart/items/update',
      expect.objectContaining({
        body: JSON.stringify({
          cartItemId: 'item-1',
          quantity: 0,
        }),
      }),
    )

    expect(result).toEqual(responseData)
  })
})
