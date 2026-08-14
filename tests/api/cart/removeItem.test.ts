import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { removeItem } from '../../../src/features/shop/actions/cart/removeItemAction'

describe('removeItem', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should remove item from cart successfully', async () => {
    const responseData = {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 2,
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

    const result = await removeItem({
      cartItemId: 'item-1',
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/shop/cart/items/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartItemId: 'item-1',
      }),
    })

    expect(result).toEqual(responseData)
  })

  it('should send the correct cart item id', async () => {
    const responseData = {
      id: 'item-99',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 1,
      price: 200000,
    }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseData), {
        status: 200,
      }),
    )

    await removeItem({
      cartItemId: 'item-99',
    })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/cart/items/delete',
      expect.objectContaining({
        body: JSON.stringify({
          cartItemId: 'item-99',
        }),
      }),
    )
  })

  it('should throw error when API request fails', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'Failed to delete item',
        }),
        {
          status: 500,
        },
      ),
    )

    await expect(
      removeItem({
        cartItemId: 'item-1',
      }),
    ).rejects.toThrow('Failed to delete item')

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should throw error when API returns unauthorized', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'Unauthorized',
        }),
        {
          status: 401,
        },
      ),
    )

    await expect(
      removeItem({
        cartItemId: 'item-1',
      }),
    ).rejects.toThrow('Failed to delete item')
  })
})
