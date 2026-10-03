import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/shop/cart/items/add/route'
import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

vi.mock('@/features/shop/services/CartService', () => ({
  CartService: {
    addItem: vi.fn(),
  },
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: vi.fn(),
}))

describe('POST /api/shop/cart/items/add', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should add item to cart successfully', async () => {
    vi.mocked(requireAuthority).mockResolvedValue({
      id: 'user-1',
    } as any)

    const cartItem = {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 2,
      price: 100000,
    }

    vi.mocked(CartService.addItem).mockResolvedValue(cartItem as any)

    const req = new Request(
      'http://localhost/api/shop/cart/items/add',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 2,
        }),
      },
    ) as NextRequest

    const response = await POST(req)

    expect(response.status).toBe(200)

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })

    expect(CartService.addItem).toHaveBeenCalledWith(
      {
        cartId: 'cart-1',
        productId: 'product-1',
        quantity: 2,
      },
      'user-1',
    )

    await expect(response.json()).resolves.toEqual(cartItem)
  })

  it('should use the authenticated user id', async () => {
    vi.mocked(requireAuthority).mockResolvedValue({
      id: 'user-123',
    } as any)

    const cartItem = {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 1,
      price: 100000,
    }

    vi.mocked(CartService.addItem).mockResolvedValue(cartItem as any)

    const req = new Request(
      'http://localhost/api/shop/cart/items/add',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 1,
        }),
      },
    ) as NextRequest

    await POST(req)

    expect(CartService.addItem).toHaveBeenCalledWith(
      expect.objectContaining({
        cartId: 'cart-1',
        productId: 'product-1',
        quantity: 1,
      }),
      'user-123',
    )
  })

  it('should return 500 when adding item fails', async () => {
    vi.mocked(requireAuthority).mockResolvedValue({
      id: 'user-1',
    } as any)

    vi.mocked(CartService.addItem).mockRejectedValue(
      new Error('Product not found'),
    )

    const req = new Request(
      'http://localhost/api/shop/cart/items/add',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 2,
        }),
      },
    ) as NextRequest

    const response = await POST(req)

    expect(response.status).toBe(500)

    await expect(response.json()).resolves.toEqual({
      error: 'Failed to add item',
    })
  })

  it('should not call CartService when authentication fails', async () => {
    vi.mocked(requireAuthority).mockRejectedValue(
      new Error('Unauthorized'),
    )

    const req = new Request(
      'http://localhost/api/shop/cart/items/add',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 2,
        }),
      },
    ) as NextRequest

    await expect(POST(req)).rejects.toThrow('Unauthorized')

    expect(CartService.addItem).not.toHaveBeenCalled()
  })
})