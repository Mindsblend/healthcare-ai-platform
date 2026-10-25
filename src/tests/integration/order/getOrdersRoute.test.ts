import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthorityMock, fetchOrdersPreviewMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  fetchOrdersPreviewMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/OrderService', () => ({
  OrderService: {
    fetchOrdersPreview: fetchOrdersPreviewMock,
  },
}))

import { GET } from '@/app/api/shop/orders/route'

describe('GET /api/shop/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthorityMock.mockResolvedValue({
      id: 'admin-123',
      role: 'ADMIN',
    })
  })

  it('returns the orders for an authorized admin', async () => {
    const orders = [
      { id: 'order-1', status: 'PENDING' },
      { id: 'order-2', status: 'PAID' },
    ]

    fetchOrdersPreviewMock.mockResolvedValue(orders)

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(orders)
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(fetchOrdersPreviewMock).toHaveBeenCalledOnce()
  })

  it('returns 500 when fetching orders fails', async () => {
    fetchOrdersPreviewMock.mockRejectedValue(new Error('Database failure'))

    const response = await GET()

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch orders',
    })
  })

  it('does not fetch orders when admin authorization fails', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('UNAUTHORIZED'))

    await expect(GET()).rejects.toThrow('UNAUTHORIZED')

    expect(fetchOrdersPreviewMock).not.toHaveBeenCalled()
  })
})
