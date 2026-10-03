import { describe, it, expect, vi, beforeEach } from 'vitest'

import { POST } from '@/app/api/shop/cart/create/route'
import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

vi.mock('@/features/shop/services/CartService', () => ({
  CartService: {
    createCart: vi.fn(),
  },
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: vi.fn(),
}))

describe('POST /api/shop/cart/create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create cart successfully for authenticated user', async () => {
    vi.mocked(requireAuthority).mockResolvedValue({
      id: 'user-123',
    } as any)

    const mockCart = {
      id: 'cart-123',
      userId: 'user-123',
      items: [],
    }

    vi.mocked(CartService.createCart).mockResolvedValue(mockCart as any)

    const response = await POST()

    expect(response.status).toBe(200)

    const data = await response.json()

    expect(data).toEqual(mockCart)

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })

    expect(CartService.createCart).toHaveBeenCalledWith({
      userId: 'user-123',
    })
  })

  it('should return 500 when cart creation fails', async () => {
    vi.mocked(requireAuthority).mockResolvedValue({
      id: 'user-123',
    } as any)

    vi.mocked(CartService.createCart).mockRejectedValue(
      new Error('Database error'),
    )

    const response = await POST()

    expect(response.status).toBe(500)

    const data = await response.json()

    expect(data).toEqual({
      error: 'Failed to create cart',
    })
  })

  it('should propagate authentication error', async () => {
    vi.mocked(requireAuthority).mockRejectedValue(new Error('Unauthorized'))

    await expect(POST()).rejects.toThrow('Unauthorized')

    expect(CartService.createCart).not.toHaveBeenCalled()
  })
})
