import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getCart } from '../../../src/features/shop/actions/cart/getCartAction'

describe('getCart', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should fetch cart successfully', async () => {
    const cart = {
      id: 'cart-1',
      userId: 'user-1',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          cartId: 'cart-1',
          quantity: 2,
          price: 100000,
          product: {
            id: 'product-1',
            title: 'Test Product',
            price: 100000,
            solution: 'Test solution',
            slug: 'test-product',
            image: '/images/product.webp',
            categoryId: 'category-1',
            category: {
              name: 'Test Category',
              iconPath: '/images/category.webp',
            },
          },
        },
      ],
    }

    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(cart), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await getCart()

    expect(fetchMock).toHaveBeenCalledWith('/api/shop/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    expect(result).toEqual(cart)
  })

  it('should return null when there is no active cart', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(null), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await getCart()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(result).toBeNull()
  })

  it('should throw error when API request fails', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {
            code: 'CART_FETCH_FAILED',
          },
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(getCart()).rejects.toThrow('CART_FETCH_FAILED')

    expect(fetchMock).toHaveBeenCalledWith('/api/shop/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  })

  it('should throw UNKNOWN when API returns an error without a code', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          error: {},
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(getCart()).rejects.toThrow('UNKNOWN')
  })
})
