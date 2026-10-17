import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const {
  findFirstMock,
  findManyMock,
  orderUpdateMock,
  cartUpdateMock,
  verifyPaymentMock,
} = vi.hoisted(() => ({
  findFirstMock: vi.fn(),
  findManyMock: vi.fn(),
  orderUpdateMock: vi.fn(),
  cartUpdateMock: vi.fn(),
  verifyPaymentMock: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findFirst: findFirstMock,
      findMany: findManyMock,
      update: orderUpdateMock,
    },
    cart: {
      update: cartUpdateMock,
    },
  },
}))

vi.mock('@/features/shop/services/PaymentService', () => ({
  PaymentService: {
    verifyPayment: verifyPaymentMock,
  },
}))

import { GET } from '@/app/api/shop/payment/verify/route'

describe('GET /api/shop/payment/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects to failure when the payment was canceled', async () => {
    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=NOK&Authority=test-authority',
    )

    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/payment/failed')
    expect(verifyPaymentMock).not.toHaveBeenCalled()
    expect(findFirstMock).not.toHaveBeenCalled()
    expect(orderUpdateMock).not.toHaveBeenCalled()
  })

  it('redirects to failure when Authority is missing', async () => {
    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK',
    )

    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/payment/failed')
    expect(findFirstMock).not.toHaveBeenCalled()
    expect(verifyPaymentMock).not.toHaveBeenCalled()
    expect(orderUpdateMock).not.toHaveBeenCalled()
  })

  it('redirects to failure when no order matches the authority', async () => {
    findFirstMock.mockResolvedValue(null)
    findManyMock.mockResolvedValue([])

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=unknown-authority',
    )

    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/payment/failed')
    expect(findFirstMock).toHaveBeenCalledWith({
      where: { paymentAuthority: 'unknown-authority' },
    })
    expect(verifyPaymentMock).not.toHaveBeenCalled()
    expect(orderUpdateMock).not.toHaveBeenCalled()
  })

  it('marks the order as paid after successful gateway verification', async () => {
    findFirstMock.mockResolvedValue({
      id: 'order-123',
      paymentAuthority: 'test-authority',
      status: 'PENDING',
      totalPrice: 1250,
      cartId: null,
      paymentRefId: null,
    })

    verifyPaymentMock.mockResolvedValue({
      success: true,
      refId: 987654321,
      message: 'Payment verified successfully',
    })

    orderUpdateMock.mockResolvedValue({})

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=test-authority',
    )

    const response = await GET(request)

    expect(verifyPaymentMock).toHaveBeenCalledWith({
      authority: 'test-authority',
      amount: 1250,
    })

    expect(orderUpdateMock).toHaveBeenCalledWith({
      where: { id: 'order-123' },
      data: expect.objectContaining({
        status: 'PAID',
        paymentRefId: '987654321',
        paymentVerifiedAt: expect.any(Date),
      }),
    })

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/payment/success')
    expect(response.headers.get('location')).toContain('refId=987654321')
    expect(response.headers.get('location')).toContain('orderId=order-123')
  })

  it('checks out the cart after successful verification when the order has a cart', async () => {
    findFirstMock.mockResolvedValue({
      id: 'order-456',
      paymentAuthority: 'cart-authority',
      status: 'PENDING',
      totalPrice: 2500,
      cartId: 'cart-123',
      paymentRefId: null,
    })

    verifyPaymentMock.mockResolvedValue({
      success: true,
      refId: 123456789,
      message: 'Payment verified successfully',
    })

    orderUpdateMock.mockResolvedValue({})
    cartUpdateMock.mockResolvedValue({})

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=cart-authority',
    )

    const response = await GET(request)

    expect(orderUpdateMock).toHaveBeenCalledWith({
      where: { id: 'order-456' },
      data: expect.objectContaining({
        status: 'PAID',
        paymentRefId: '123456789',
      }),
    })

    expect(cartUpdateMock).toHaveBeenCalledWith({
      where: { id: 'cart-123' },
      data: { status: 'CHECKED_OUT' },
    })

    expect(response.headers.get('location')).toContain('/payment/success')
  })

  it('marks the order as failed when gateway verification is rejected', async () => {
    findFirstMock.mockResolvedValue({
      id: 'order-789',
      paymentAuthority: 'rejected-authority',
      status: 'PENDING',
      totalPrice: 1800,
      cartId: 'cart-789',
      paymentRefId: null,
    })

    verifyPaymentMock.mockResolvedValue({
      success: false,
      message: 'Verification rejected',
    })

    orderUpdateMock.mockResolvedValue({})

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=rejected-authority',
    )

    const response = await GET(request)

    expect(orderUpdateMock).toHaveBeenCalledWith({
      where: { id: 'order-789' },
      data: {
        status: 'FAILED',
        paymentErrorMessage: 'Verification rejected',
      },
    })

    expect(cartUpdateMock).not.toHaveBeenCalled()
    expect(response.headers.get('location')).toContain('/payment/failed')
    expect(response.headers.get('location')).toContain(
      encodeURIComponent('Verification rejected'),
    )
  })

  it('redirects an already-paid order to success without verifying again', async () => {
    findFirstMock.mockResolvedValue({
      id: 'order-paid',
      paymentAuthority: 'already-paid-authority',
      status: 'PAID',
      totalPrice: 1800,
      cartId: 'cart-paid',
      paymentRefId: 'existing-ref-123',
    })

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=already-paid-authority',
    )

    const response = await GET(request)

    expect(response.headers.get('location')).toContain('/payment/success')
    expect(response.headers.get('location')).toContain('refId=existing-ref-123')
    expect(response.headers.get('location')).toContain('orderId=order-paid')
    expect(verifyPaymentMock).not.toHaveBeenCalled()
    expect(orderUpdateMock).not.toHaveBeenCalled()
    expect(cartUpdateMock).not.toHaveBeenCalled()
  })

  it('redirects to failure when the database lookup throws', async () => {
    findFirstMock.mockRejectedValue(new Error('Database unavailable'))

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=test-authority',
    )

    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/payment/failed')
    expect(verifyPaymentMock).not.toHaveBeenCalled()
    expect(orderUpdateMock).not.toHaveBeenCalled()
  })

  it('redirects to failure when payment verification throws', async () => {
    findFirstMock.mockResolvedValue({
      id: 'order-error',
      paymentAuthority: 'error-authority',
      status: 'PENDING',
      totalPrice: 1800,
      cartId: null,
      paymentRefId: null,
    })

    verifyPaymentMock.mockRejectedValue(
      new Error('Payment gateway unavailable'),
    )

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=error-authority',
    )

    const response = await GET(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/payment/failed')
    expect(orderUpdateMock).not.toHaveBeenCalled()
  })
})
