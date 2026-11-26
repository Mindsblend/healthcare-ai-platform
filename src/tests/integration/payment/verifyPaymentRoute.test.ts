import { beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const {
  findFirstMock,
  findManyMock,
  orderUpdateMock,
  cartUpdateMock,
  verifyPaymentMock,
  transactionMock,
  txOrderUpdateManyMock,
  txOrderFindUniqueMock,
  txCartUpdateMock,
  findUniqueOrThrowMock,
  txNotificationPreferenceFindUniqueMock,
  txNotificationCreateManyMock,
} = vi.hoisted(() => ({
  findFirstMock: vi.fn(),
  findManyMock: vi.fn(),
  orderUpdateMock: vi.fn(),
  cartUpdateMock: vi.fn(),
  verifyPaymentMock: vi.fn(),
  transactionMock: vi.fn(),
  txOrderUpdateManyMock: vi.fn(),
  txOrderFindUniqueMock: vi.fn(),
  txCartUpdateMock: vi.fn(),
  findUniqueOrThrowMock: vi.fn(),
  txNotificationPreferenceFindUniqueMock: vi.fn(),
  txNotificationCreateManyMock: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findFirst: findFirstMock,
      findMany: findManyMock,
      update: orderUpdateMock,
      updateMany: vi.fn(),
      findUniqueOrThrow: findUniqueOrThrowMock,
    },
    cart: {
      update: cartUpdateMock,
    },
    $transaction: transactionMock,
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
    txOrderUpdateManyMock.mockResolvedValue({ count: 1 })
    txOrderFindUniqueMock.mockResolvedValue({
      id: 'order-123',
      userId: 'user-123',
      cartId: null,
      status: 'PENDING',
    })
    findUniqueOrThrowMock.mockResolvedValue({
      id: 'order-123',
      status: 'PAID',
      paymentRefId: '987654321',
      paymentVerifiedAt: new Date(),
    })
    txCartUpdateMock.mockResolvedValue({})
    txNotificationPreferenceFindUniqueMock.mockResolvedValue({ orderUpdates: true })
    txNotificationCreateManyMock.mockResolvedValue({ count: 1 })
    transactionMock.mockImplementation(async (callback: any) => {
      return callback({
        order: {
          updateMany: txOrderUpdateManyMock,
          findUnique: txOrderFindUniqueMock,
        },
        cart: {
          update: txCartUpdateMock,
        },
        notificationPreference: {
          findUnique: txNotificationPreferenceFindUniqueMock,
        },
        notification: {
          createMany: txNotificationCreateManyMock,
        },
      })
    })
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

    findUniqueOrThrowMock.mockResolvedValueOnce({
      id: 'order-123',
      status: 'PAID',
      paymentRefId: '987654321',
      paymentVerifiedAt: new Date(),
    })

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=test-authority',
    )

    const response = await GET(request)

    expect(verifyPaymentMock).toHaveBeenCalledWith({
      authority: 'test-authority',
      amount: 1250,
    })

    expect(txOrderUpdateManyMock).toHaveBeenCalledWith({
      where: { id: 'order-123', status: 'PENDING' },
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

    txOrderFindUniqueMock.mockResolvedValueOnce({
      id: 'order-456',
      userId: 'user-123',
      cartId: 'cart-123',
      status: 'PENDING',
    })

    findUniqueOrThrowMock.mockResolvedValueOnce({
      id: 'order-456',
      status: 'PAID',
      paymentRefId: '123456789',
      paymentVerifiedAt: new Date(),
    })

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=cart-authority',
    )

    const response = await GET(request)

    expect(txOrderUpdateManyMock).toHaveBeenCalledWith({
      where: { id: 'order-456', status: 'PENDING' },
      data: expect.objectContaining({
        status: 'PAID',
        paymentRefId: '123456789',
      }),
    })

    expect(txCartUpdateMock).toHaveBeenCalledWith({
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

    txOrderFindUniqueMock.mockResolvedValueOnce({
      id: 'order-789',
      userId: 'user-123',
      cartId: 'cart-789',
      status: 'PENDING',
    })

    findUniqueOrThrowMock.mockResolvedValueOnce({
      id: 'order-789',
      status: 'FAILED',
      paymentErrorMessage: 'Verification rejected',
    })

    const request = new NextRequest(
      'http://localhost/api/shop/payment/verify?Status=OK&Authority=rejected-authority',
    )

    const response = await GET(request)

    expect(txOrderUpdateManyMock).toHaveBeenCalledWith({
      where: { id: 'order-789', status: 'PENDING' },
      data: {
        status: 'FAILED',
        paymentErrorMessage: 'Verification rejected',
      },
    })

    expect(txCartUpdateMock).not.toHaveBeenCalled()
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
    expect(transactionMock).not.toHaveBeenCalled()
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
    expect(transactionMock).not.toHaveBeenCalled()
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
    expect(transactionMock).not.toHaveBeenCalled()
  })
})
