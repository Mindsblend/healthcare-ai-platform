import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { requestPaymentMock, updateOrderPaymentAuthorityMock } = vi.hoisted(
  () => ({
    requestPaymentMock: vi.fn(),
    updateOrderPaymentAuthorityMock: vi.fn(),
  }),
)

vi.mock('@/features/shop/services/PaymentService', () => ({
  PaymentService: {
    requestPayment: requestPaymentMock,
  },
}))

vi.mock('@/features/shop/services/OrderService', () => ({
  OrderService: {
    updateOrderPaymentAuthority: updateOrderPaymentAuthorityMock,
  },
}))

import { POST } from '@/app/api/shop/payment/request/route'

describe('POST /api/shop/payment/request', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const makeRequest = (body: unknown) =>
    new NextRequest('http://localhost/api/shop/payment/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

  it('returns 400 when amount is missing', async () => {
    const response = await POST(
      makeRequest({ description: 'Order payment', orderId: 'order-123' }),
    )

    expect(response.status).toBe(400)
    expect(requestPaymentMock).not.toHaveBeenCalled()
  })

  it('returns 400 when description is missing', async () => {
    const response = await POST(
      makeRequest({ amount: 1500, orderId: 'order-123' }),
    )

    expect(response.status).toBe(400)
    expect(requestPaymentMock).not.toHaveBeenCalled()
  })

  it('returns 400 when orderId is missing', async () => {
    const response = await POST(
      makeRequest({ amount: 1500, description: 'Order payment' }),
    )

    expect(response.status).toBe(400)
    expect(requestPaymentMock).not.toHaveBeenCalled()
  })

  it('returns payment details and saves the authority on success', async () => {
    requestPaymentMock.mockResolvedValue({
      success: true,
      authority: 'test-authority',
      paymentUrl: 'https://payment.example/start',
    })
    updateOrderPaymentAuthorityMock.mockResolvedValue({})

    const response = await POST(
      makeRequest({
        amount: '1500',
        description: 'Order payment',
        orderId: 'order-123',
        email: 'test@example.com',
        mobile: '09123456789',
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      authority: 'test-authority',
      paymentUrl: 'https://payment.example/start',
    })

    expect(requestPaymentMock).toHaveBeenCalledWith({
      amount: 1500,
      description: 'Order payment',
      orderId: 'order-123',
      email: 'test@example.com',
      mobile: '09123456789',
    })

    expect(updateOrderPaymentAuthorityMock).toHaveBeenCalledWith({
      orderId: 'order-123',
      authority: 'test-authority',
    })
  })

  it('returns 400 when the payment service rejects the request', async () => {
    requestPaymentMock.mockResolvedValue({
      success: false,
      error: 'Payment provider rejected the request',
    })

    const response = await POST(
      makeRequest({
        amount: 1500,
        description: 'Order payment',
        orderId: 'order-123',
      }),
    )

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Payment provider rejected the request',
    })
    expect(updateOrderPaymentAuthorityMock).not.toHaveBeenCalled()
  })

  it('returns 500 when parsing the request body fails', async () => {
    const request = new NextRequest(
      'http://localhost/api/shop/payment/request',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid-json',
      },
    )

    const response = await POST(request)

    expect(response.status).toBe(500)
    expect(requestPaymentMock).not.toHaveBeenCalled()
    expect(updateOrderPaymentAuthorityMock).not.toHaveBeenCalled()
  })

  it('still returns success when saving the payment authority fails', async () => {
    requestPaymentMock.mockResolvedValue({
      success: true,
      authority: 'test-authority',
      paymentUrl: 'https://payment.example/start',
    })

    updateOrderPaymentAuthorityMock.mockRejectedValue(
      new Error('Database unavailable'),
    )

    const response = await POST(
      makeRequest({
        amount: 1500,
        description: 'Order payment',
        orderId: 'order-123',
      }),
    )

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      success: true,
      authority: 'test-authority',
      paymentUrl: 'https://payment.example/start',
    })
  })

  it('returns 500 when the payment service throws unexpectedly', async () => {
    requestPaymentMock.mockRejectedValue(
      new Error('Payment service unavailable'),
    )

    const response = await POST(
      makeRequest({
        amount: 1500,
        description: 'Order payment',
        orderId: 'order-123',
      }),
    )

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({
      success: false,
      error: 'Payment service unavailable',
    })

    expect(updateOrderPaymentAuthorityMock).not.toHaveBeenCalled()
  })
})
