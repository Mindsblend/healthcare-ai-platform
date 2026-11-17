
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const {
  requestPaymentMock,
  getOrderForPaymentMock,
  updateOrderPaymentAuthorityMock,
  requireAuthorityMock,
} = vi.hoisted(() => ({
  requestPaymentMock: vi.fn(),
  getOrderForPaymentMock: vi.fn(),
  updateOrderPaymentAuthorityMock: vi.fn(),
  requireAuthorityMock: vi.fn(),
}))

vi.mock('@/features/shop/services/PaymentService', () => ({
  PaymentService: {
    requestPayment: requestPaymentMock,
  },
}))

vi.mock('@/features/shop/services/OrderService', () => ({
  OrderService: {
    getOrderForPayment: getOrderForPaymentMock,
    updateOrderPaymentAuthority: updateOrderPaymentAuthorityMock,
  },
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority: requireAuthorityMock,
}))

import { POST } from '@/app/api/shop/payment/request/route'

describe('POST /api/shop/payment/request', () => {
  const order = {
    id: 'order-123',
    userId: 'user-123',
    status: 'PENDING',
    totalPrice: 308175,
    shippingEmail: 'test@example.com',
    shippingPhone: '09123456789',
  }

  const makeRequest = (body: unknown) =>
    new NextRequest('http://localhost/api/shop/payment/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  beforeEach(() => {
    vi.clearAllMocks()

    requireAuthorityMock.mockResolvedValue({
      id: 'user-123',
    })

    getOrderForPaymentMock.mockResolvedValue(order)

    requestPaymentMock.mockResolvedValue({
      success: true,
      authority: 'test-authority',
      paymentUrl: 'https://payment.example/start',
    })

    updateOrderPaymentAuthorityMock.mockResolvedValue({})
  })

  it('rejects requests without authentication', async () => {
    const error = Object.assign(new Error('Unauthorized'), {
      status: 401,
    })

    requireAuthorityMock.mockRejectedValue(error)

    const response = await POST(
      makeRequest({ orderId: 'order-123' }),
    )

    expect(response.status).toBe(401)
    expect(requestPaymentMock).not.toHaveBeenCalled()
    expect(getOrderForPaymentMock).not.toHaveBeenCalled()
  })

  it('rejects requests without orderId', async () => {
    const response = await POST(makeRequest({}))

    expect(response.status).toBe(400)
    expect(getOrderForPaymentMock).not.toHaveBeenCalled()
    expect(requestPaymentMock).not.toHaveBeenCalled()
  })

  it('loads the order using the authenticated user ID', async () => {
    await POST(makeRequest({
      orderId: 'order-123',
    }))

    expect(getOrderForPaymentMock).toHaveBeenCalledWith({
      orderId: 'order-123',
      userId: 'user-123',
    })
  })

  it('rejects orders that do not belong to the authenticated user', async () => {
    getOrderForPaymentMock.mockResolvedValue(null)

    const response = await POST(
      makeRequest({ orderId: 'another-users-order' }),
    )

    expect(response.status).toBe(404)
    expect(requestPaymentMock).not.toHaveBeenCalled()
  })

  it('uses the stored order amount instead of the client amount', async () => {
    await POST(
      makeRequest({
        orderId: 'order-123',
        amount: 100,
        description: 'Fake description',
        email: 'attacker@example.com',
        mobile: '09000000000',
      }),
    )

    expect(requestPaymentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 308175,
        orderId: 'order-123',
        email: 'test@example.com',
        mobile: '09123456789',
      }),
    )
  })

  it('does not request payment for an order that is not pending', async () => {
    getOrderForPaymentMock.mockResolvedValue({
      ...order,
      status: 'PAID',
    })

    const response = await POST(
      makeRequest({ orderId: 'order-123' }),
    )

    expect(response.status).toBe(409)
    expect(requestPaymentMock).not.toHaveBeenCalled()
  })

  it('returns payment URL only after authority is saved successfully', async () => {
    const response = await POST(
      makeRequest({ orderId: 'order-123' }),
    )

    expect(response.status).toBe(200)

    await expect(response.json()).resolves.toEqual({
      success: true,
      authority: 'test-authority',
      paymentUrl: 'https://payment.example/start',
    })

    expect(updateOrderPaymentAuthorityMock).toHaveBeenCalledWith({
      orderId: 'order-123',
      authority: 'test-authority',
    })
  })

  it('does not return payment URL if saving authority fails', async () => {
    updateOrderPaymentAuthorityMock.mockRejectedValue(
      new Error('Database unavailable'),
    )

    const response = await POST(
      makeRequest({ orderId: 'order-123' }),
    )

    expect(response.status).toBe(500)

    const body = await response.json()

    expect(body.success).toBe(false)
    expect(body.paymentUrl).toBeUndefined()
  })

  it('does not save authority when payment provider rejects the request', async () => {
    requestPaymentMock.mockResolvedValue({
      success: false,
      error: 'Payment provider rejected the request',
    })

    const response = await POST(
      makeRequest({ orderId: 'order-123' }),
    )

    expect(response.status).toBe(400)
    expect(updateOrderPaymentAuthorityMock).not.toHaveBeenCalled()
  })

  it('does not request payment when order lookup fails', async () => {
    getOrderForPaymentMock.mockRejectedValue(
      new Error('Database unavailable'),
    )

    const response = await POST(
      makeRequest({ orderId: 'order-123' }),
    )

    expect(response.status).toBe(500)
    expect(requestPaymentMock).not.toHaveBeenCalled()
  })
})
