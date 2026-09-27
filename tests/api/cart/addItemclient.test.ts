import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { addItem } from '@/features/shop/actions/cart/addItemAction'

describe('addItem', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should add item to cart successfully', async () => {
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

    const result = await addItem({
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 2,
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/shop/cart/items/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartId: 'cart-1',
        productId: 'product-1',
        quantity: 2,
      }),
    })

    expect(result).toEqual(responseData)
  })

  it('should use quantity 1 by default', async () => {
    const responseData = {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 1,
      price: 100000,
    }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseData), {
        status: 200,
      }),
    )

    const result = await addItem({
      cartId: 'cart-1',
      productId: 'product-1',
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/shop/cart/items/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cartId: 'cart-1',
        productId: 'product-1',
        quantity: 1,
      }),
    })

    expect(result).toEqual(responseData)
  })

  it('should throw error when API request fails', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'Failed to add item',
        }),
        {
          status: 500,
        },
      ),
    )

    await expect(
      addItem({
        cartId: 'cart-1',
        productId: 'product-1',
        quantity: 2,
      }),
    ).rejects.toThrow('Failed to add item')

    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('should send the correct product and cart ids', async () => {
    const responseData = {
      id: 'item-1',
      cartId: 'cart-99',
      productId: 'product-99',
      quantity: 3,
      price: 250000,
    }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(responseData), {
        status: 200,
      }),
    )

    await addItem({
      cartId: 'cart-99',
      productId: 'product-99',
      quantity: 3,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/cart/items/add',
      expect.objectContaining({
        body: JSON.stringify({
          cartId: 'cart-99',
          productId: 'product-99',
          quantity: 3,
        }),
      }),
    )
  })
})
