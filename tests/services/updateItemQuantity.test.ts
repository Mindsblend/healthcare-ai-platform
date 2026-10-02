import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { updateItemQuantity } from '@/features/shop/actions/cart/updateItemAction'
import type { UpdateItemQuantityInput } from '@/features/shop/shop.types'

describe('updateItemQuantity', () => {
  const input: UpdateItemQuantityInput = {
    cartItemId: 'item-1',
    quantity: 3,
  }

  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should update cart item quantity successfully', async () => {
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

    const result = await updateItemQuantity(input)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(fetchMock).toHaveBeenCalledWith('/api/shop/cart/items/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    })

    expect(result).toEqual(responseData)
  })

  it('should throw an error when the request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'Failed to update item',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(updateItemQuantity(input)).rejects.toThrow(
      'Failed to update item',
    )
  })

  it('should send the correct quantity', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
      }),
    )

    const customInput: UpdateItemQuantityInput = {
      cartItemId: 'item-1',
      quantity: 5,
    }

    await updateItemQuantity(customInput)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/cart/items/update',
      expect.objectContaining({
        body: JSON.stringify(customInput),
      }),
    )
  })

  it('should send the correct request method and headers', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
      }),
    )

    await updateItemQuantity(input)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/cart/items/update',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
  })
})
