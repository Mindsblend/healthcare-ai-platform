import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/shop/cart/route'
import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

vi.mock('@/features/shop/services/CartService', () => ({
  CartService: {
    fetchActiveCart: vi.fn(),
  },
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: vi.fn(),
}))

describe('GET /api/shop/cart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return active cart successfully', async () => {
    vi.mocked(requireAuthority).mockResolvedValue({
      id: 'user-1',
    } as any)

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

    vi.mocked(CartService.fetchActiveCart).mockResolvedValue(cart as any)

    const response = await GET()

    expect(response.status).toBe(200)

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })

    expect(CartService.fetchActiveCart).toHaveBeenCalledWith({
      userId: 'user-1',
    })

    await expect(response.json()).resolves.toEqual(cart)
  })

  it('should return null when user has no active cart', async () => {
    vi.mocked(requireAuthority).mockResolvedValue({
      id: 'user-1',
    } as any)

    vi.mocked(CartService.fetchActiveCart).mockResolvedValue(null)

    const response = await GET()

    expect(response.status).toBe(200)

    expect(CartService.fetchActiveCart).toHaveBeenCalledWith({
      userId: 'user-1',
    })

    await expect(response.json()).resolves.toBeNull()
  })

  it('should return 500 when fetching cart fails', async () => {
    vi.mocked(requireAuthority).mockResolvedValue({
      id: 'user-1',
    } as any)

    vi.mocked(CartService.fetchActiveCart).mockRejectedValue(
      new Error('Database error'),
    )

    const response = await GET()

    expect(response.status).toBe(500)

    await expect(response.json()).resolves.toEqual({
      error: 'Failed to fetch cart',
    })
  })

  it('should not call CartService when authentication fails', async () => {
    vi.mocked(requireAuthority).mockRejectedValue(
      new Error('Unauthorized'),
    )

    await expect(GET()).rejects.toThrow('Unauthorized')

    expect(CartService.fetchActiveCart).not.toHaveBeenCalled()
  })
})