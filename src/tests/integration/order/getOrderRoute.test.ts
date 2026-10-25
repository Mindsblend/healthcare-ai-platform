import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { fetchOrderByIdMock, requireAuthorityMock } = vi.hoisted(() => ({
  fetchOrderByIdMock: vi.fn(),
  requireAuthorityMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/OrderService', () => ({
  OrderService: {
    fetchOrderById: fetchOrderByIdMock,
  },
}))

import { GET } from '@/app/api/shop/orders/[id]/route'

describe('GET /api/shop/orders/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })
  })

  it('returns the order when it exists', async () => {
    const order = {
      id: 'order-123',
      userId: 'user-123',
      status: 'PENDING',
    }

    fetchOrderByIdMock.mockResolvedValue(order)

    const request = new NextRequest(
      'http://localhost/api/shop/orders/order-123',
    )

    const response = await GET(request, {
      params: Promise.resolve({ id: 'order-123' }),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(order)
    expect(fetchOrderByIdMock).toHaveBeenCalledWith({ id: 'order-123' })
  })

  it('returns 404 when the order does not exist', async () => {
    fetchOrderByIdMock.mockResolvedValue(null)

    const request = new NextRequest(
      'http://localhost/api/shop/orders/missing-order',
    )

    const response = await GET(request, {
      params: Promise.resolve({ id: 'missing-order' }),
    })

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Order not found' })
  })

  it('returns 500 when fetching the order throws', async () => {
    fetchOrderByIdMock.mockRejectedValue(new Error('Database failure'))

    const request = new NextRequest(
      'http://localhost/api/shop/orders/order-123',
    )

    const response = await GET(request, {
      params: Promise.resolve({ id: 'order-123' }),
    })

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch order',
    })
  })

  it('requires authentication before fetching an order', async () => {
    requireAuthorityMock.mockRejectedValue(new Error('UNAUTHORIZED'))

    const request = new NextRequest(
      'http://localhost/api/shop/orders/order-123',
    )

    const response = await GET(request, {
      params: Promise.resolve({ id: 'order-123' }),
    })

    expect(response.status).toBe(401)
    expect(fetchOrderByIdMock).not.toHaveBeenCalled()
  })

  it('returns 403 when a user tries to access another user’s order', async () => {
    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })

    fetchOrderByIdMock.mockResolvedValue({
      id: 'order-123',
      userId: 'another-user',
      status: 'PENDING',
    })

    const request = new NextRequest(
      'http://localhost/api/shop/orders/order-123',
    )

    const response = await GET(request, {
      params: Promise.resolve({ id: 'order-123' }),
    })

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({ error: 'Forbidden' })
  })

  it('allows an admin to access another user’s order', async () => {
    requireAuthorityMock.mockResolvedValue({
      id: 'admin-123',
      role: 'ADMIN',
    })

    const order = {
      id: 'order-123',
      userId: 'another-user',
      status: 'PENDING',
    }

    fetchOrderByIdMock.mockResolvedValue(order)

    const request = new NextRequest(
      'http://localhost/api/shop/orders/order-123',
    )

    const response = await GET(request, {
      params: Promise.resolve({ id: 'order-123' }),
    })

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(order)
  })
})
