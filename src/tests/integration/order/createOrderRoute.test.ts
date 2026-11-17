import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { requireAuthorityMock, createOrderMock } = vi.hoisted(() => ({
  requireAuthorityMock: vi.fn(),
  createOrderMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

vi.mock('@/features/shop/services/OrderService', () => ({
  OrderService: {
    createOrder: createOrderMock,
  },
}))

import { POST } from '@/app/api/shop/orders/create/route'

describe('POST /api/shop/orders/create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
      role: 'USER',
    })
  })

  it('creates an order for the authenticated user', async () => {
    const order = {
      id: 'order-123',
      userId: 'user-123',
      status: 'PENDING',
    }

    createOrderMock.mockResolvedValue(order)

    const request = new NextRequest('http://localhost/api/shop/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cartId: 'cart-123',
        userId: 'attacker-user',
        shippingAddress: 'Test address',
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual(order)
    expect(requireAuthorityMock).toHaveBeenCalledWith({
      requiredRole: 'USER',
    })

    expect(createOrderMock).toHaveBeenCalledWith({
      cartId: 'cart-123',
      userId: 'user-123',
      shippingAddress: 'Test address',
    })
  })

  it('returns an error when order creation fails', async () => {
    createOrderMock.mockRejectedValue(new Error('Order creation failed'))

    const request = new NextRequest('http://localhost/api/shop/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartId: 'cart-123' }),
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Order creation failed',
    })
  })
})
