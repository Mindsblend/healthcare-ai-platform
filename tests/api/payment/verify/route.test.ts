import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

import { GET } from '@/app/api/shop/payment/verify/route'
import { prisma } from '@/lib/prisma'
import { PaymentService } from '@/features/shop/services/PaymentService'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
    },
    cart: {
      update: vi.fn(),
    },
  },
}))

vi.mock('@/features/shop/services/PaymentService', () => ({
  PaymentService: {
    verifyPayment: vi.fn(),
  },
}))

const mockedPrisma = vi.mocked(prisma)
const mockedVerifyPayment = vi.mocked(PaymentService.verifyPayment)

function createRequest(authority?: string, status?: string): NextRequest {
  const url = new URL('http://localhost:3000/api/shop/payment/verify')

  if (authority !== undefined) {
    url.searchParams.set('Authority', authority)
  }

  if (status !== undefined) {
    url.searchParams.set('Status', status)
  }

  return new NextRequest(url)
}

function getDecodedLocation(response: Response) {
  const location = response.headers.get('location')

  expect(location).toBeTruthy()

  return decodeURIComponent(location!)
}

describe('GET /api/shop/payment/verify', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to failed page when payment is canceled', async () => {
    const request = createRequest('AUTH-123', 'NOK')

    const response = await GET(request)

    expect(response.status).toBe(307)

    const location = getDecodedLocation(response)

    expect(location).toContain('/payment/failed')
    expect(location).toContain('کاربر پرداخت را لغو کرد')

    expect(mockedPrisma.order.findFirst).not.toHaveBeenCalled()
    expect(mockedVerifyPayment).not.toHaveBeenCalled()
  })

  it('should redirect to failed page when authority is missing', async () => {
    const request = createRequest(undefined, 'OK')

    const response = await GET(request)

    expect(response.status).toBe(307)

    const location = getDecodedLocation(response)

    expect(location).toContain('/payment/failed')
    expect(location).toContain('شناسه پرداخت معتبر نیست')

    expect(mockedPrisma.order.findFirst).not.toHaveBeenCalled()
    expect(mockedVerifyPayment).not.toHaveBeenCalled()
  })

  it('should redirect to failed page when order is not found', async () => {
    mockedPrisma.order.findFirst.mockResolvedValue(null)

    mockedPrisma.order.findMany.mockResolvedValue([])

    const request = createRequest('AUTH-404', 'OK')

    const response = await GET(request)

    expect(response.status).toBe(307)

    const location = getDecodedLocation(response)

    expect(location).toContain('/payment/failed')
    expect(location).toContain('سفارش با شناسه AUTH-404 یافت نشد')

    expect(mockedPrisma.order.findFirst).toHaveBeenCalledWith({
      where: {
        paymentAuthority: 'AUTH-404',
      },
    })

    expect(mockedVerifyPayment).not.toHaveBeenCalled()
  })

  it('should redirect to success page when order is already paid', async () => {
    mockedPrisma.order.findFirst.mockResolvedValue({
      id: 'order-123',
      paymentAuthority: 'AUTH-123',
      status: 'PAID',
      totalPrice: 3566461,
      paymentRefId: '987654321',
      cartId: 'cart-123',
    } as any)

    const request = createRequest('AUTH-123', 'OK')

    const response = await GET(request)

    expect(response.status).toBe(307)

    const location = getDecodedLocation(response)

    expect(location).toContain('/payment/success')
    expect(location).toContain('refId=987654321')
    expect(location).toContain('orderId=order-123')

    expect(mockedVerifyPayment).not.toHaveBeenCalled()
    expect(mockedPrisma.order.update).not.toHaveBeenCalled()
    expect(mockedPrisma.cart.update).not.toHaveBeenCalled()
  })

  it('should verify payment and mark order as PAID', async () => {
    mockedPrisma.order.findFirst.mockResolvedValue({
      id: 'order-123',
      paymentAuthority: 'AUTH-123',
      status: 'PENDING',
      totalPrice: 3566461,
      paymentRefId: null,
      cartId: 'cart-123',
    } as any)

    mockedVerifyPayment.mockResolvedValue({
      success: true,
      refId: 987654321,
      message: 'Payment verified successfully',
    })

    mockedPrisma.order.update.mockResolvedValue({} as any)
    mockedPrisma.cart.update.mockResolvedValue({} as any)

    const request = createRequest('AUTH-123', 'OK')

    const response = await GET(request)

    expect(response.status).toBe(307)

    const location = getDecodedLocation(response)

    expect(location).toContain('/payment/success')
    expect(location).toContain('refId=987654321')
    expect(location).toContain('orderId=order-123')

    expect(mockedVerifyPayment).toHaveBeenCalledWith({
      authority: 'AUTH-123',
      amount: 3566461,
    })

    expect(mockedPrisma.order.update).toHaveBeenCalledWith({
      where: {
        id: 'order-123',
      },
      data: expect.objectContaining({
        status: 'PAID',
        paymentRefId: '987654321',
        paymentVerifiedAt: expect.any(Date),
      }),
    })

    expect(mockedPrisma.cart.update).toHaveBeenCalledWith({
      where: {
        id: 'cart-123',
      },
      data: {
        status: 'CHECKED_OUT',
      },
    })
  })

  it('should mark order as FAILED when payment verification fails', async () => {
    mockedPrisma.order.findFirst.mockResolvedValue({
      id: 'order-456',
      paymentAuthority: 'AUTH-456',
      status: 'PENDING',
      totalPrice: 250000,
      paymentRefId: null,
      cartId: 'cart-456',
    } as any)

    mockedVerifyPayment.mockResolvedValue({
      success: false,
      message: 'پرداخت توسط درگاه تأیید نشد',
    })

    mockedPrisma.order.update.mockResolvedValue({} as any)

    const request = createRequest('AUTH-456', 'OK')

    const response = await GET(request)

    expect(response.status).toBe(307)

    const location = getDecodedLocation(response)

    expect(location).toContain('/payment/failed')
    expect(location).toContain('پرداخت توسط درگاه تأیید نشد')

    expect(mockedVerifyPayment).toHaveBeenCalledWith({
      authority: 'AUTH-456',
      amount: 250000,
    })

    expect(mockedPrisma.order.update).toHaveBeenCalledWith({
      where: {
        id: 'order-456',
      },
      data: {
        status: 'FAILED',
        paymentErrorMessage: 'پرداخت توسط درگاه تأیید نشد',
      },
    })

    expect(mockedPrisma.cart.update).not.toHaveBeenCalled()
  })

  it('should redirect to failed page when an unexpected error occurs', async () => {
    mockedPrisma.order.findFirst.mockRejectedValue(
      new Error('Database connection failed'),
    )

    const request = createRequest('AUTH-ERROR', 'OK')

    const response = await GET(request)

    expect(response.status).toBe(307)

    const location = getDecodedLocation(response)

    expect(location).toContain('/payment/failed')
    expect(location).toContain('خطا در تأیید پرداخت')

    expect(mockedVerifyPayment).not.toHaveBeenCalled()
  })

  it('should mark order as PAID without updating cart when cartId is missing', async () => {
    mockedPrisma.order.findFirst.mockResolvedValue({
      id: 'order-no-cart',
      paymentAuthority: 'AUTH-NOCART',
      status: 'PENDING',
      totalPrice: 100000,
      paymentRefId: null,
      cartId: null,
    } as any)

    mockedVerifyPayment.mockResolvedValue({
      success: true,
      refId: 111222333,
      message: 'Payment verified successfully',
    })

    mockedPrisma.order.update.mockResolvedValue({} as any)

    const request = createRequest('AUTH-NOCART', 'OK')

    const response = await GET(request)

    expect(response.status).toBe(307)

    const location = getDecodedLocation(response)

    expect(location).toContain('/payment/success')
    expect(location).toContain('refId=111222333')
    expect(location).toContain('orderId=order-no-cart')

    expect(mockedPrisma.order.update).toHaveBeenCalledWith({
      where: {
        id: 'order-no-cart',
      },
      data: expect.objectContaining({
        status: 'PAID',
        paymentRefId: '111222333',
        paymentVerifiedAt: expect.any(Date),
      }),
    })

    expect(mockedPrisma.cart.update).not.toHaveBeenCalled()
  })
})
