import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GET } from '@/app/api/shop/profile/pages/order/route'

const { requireAuthority, fetchUserWithOrders } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  fetchUserWithOrders: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/shop/services/UserService', () => ({
  UserService: {
    fetchUserWithOrders,
  },
}))

describe('GET /api/shop/profile/pages/order', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns orders belonging to the current user', async () => {
    const session = { id: 'user-123' }
    const orders = [
      {
        id: 'order-1',
        status: 'DELIVERED',
        items: [{ productId: 'product-1', quantity: 2 }],
      },
    ]

    requireAuthority.mockResolvedValue(session)
    fetchUserWithOrders.mockResolvedValue(orders)

    const response = await GET()

    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })
    expect(fetchUserWithOrders).toHaveBeenCalledWith(session.id)
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual(orders)
  })

  it('propagates authorization failure without fetching orders', async () => {
    requireAuthority.mockRejectedValue(new Error('Unauthorized'))

    await expect(GET()).rejects.toThrow('Unauthorized')
    expect(fetchUserWithOrders).not.toHaveBeenCalled()
  })

  it('returns 500 when fetching orders fails', async () => {
    requireAuthority.mockResolvedValue({ id: 'user-123' })
    fetchUserWithOrders.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET()

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      error: 'Failed to fetch user orders',
    })
  })
})
