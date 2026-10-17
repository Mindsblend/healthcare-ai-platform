import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { requireAuthorityMock, updateOrderMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  updateOrderMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/OrderService', () => ({
  OrderService: {
    updateOrder: updateOrderMock,
  },
}))

import { POST } from '@/app/api/shop/orders/update/route'

function makeRequest(body: unknown) {
  return new NextRequest('http://localhost/api/shop/orders/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/shop/orders/update', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthorityMock.mockResolvedValue({
      id: 'admin-123',
      role: 'ADMIN',
    })
    updateOrderMock.mockResolvedValue({
      id: 'order-123',
      status: 'PAID',
    })
  })

  it('allows an admin to update an order status', async () => {
    const response = await POST(
      makeRequest({ orderId: 'order-123', status: 'PAID' }),
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      id: 'order-123',
      status: 'PAID',
    })
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(updateOrderMock).toHaveBeenCalledWith({
      orderId: 'order-123',
      status: 'PAID',
    })
  })

  it('rejects a request without an order ID', async () => {
    const response = await POST(makeRequest({ status: 'PAID' }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'orderId is required',
    })
    expect(requireAuthorityMock).not.toHaveBeenCalled()
    expect(updateOrderMock).not.toHaveBeenCalled()
  })

  it('rejects a request without valid update fields', async () => {
    const response = await POST(makeRequest({ orderId: 'order-123' }))

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'No valid updates provided',
    })
    expect(updateOrderMock).not.toHaveBeenCalled()
  })

  it('returns 404 when the order does not exist', async () => {
    updateOrderMock.mockRejectedValue(new Error('Order not found'))

    const response = await POST(
      makeRequest({ orderId: 'missing-order', status: 'PAID' }),
    )

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Order not found',
    })
  })

  it('does not update an order when authorization fails', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('UNAUTHORIZED'))

    const response = await POST(
      makeRequest({ orderId: 'order-123', status: 'PAID' }),
    )

    expect(response.status).toBe(500)
    expect(updateOrderMock).not.toHaveBeenCalled()
  })
})
