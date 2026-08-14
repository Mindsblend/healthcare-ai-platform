import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

import { POST } from '@/app/api/shop/payment/request/route'
import { PaymentService } from '@/features/shop/services/PaymentService'
import { OrderService } from '@/features/shop/services/OrderService'

vi.mock('@/features/shop/services/PaymentService', () => ({
  PaymentService: {
    requestPayment: vi.fn(),
  },
}))

vi.mock('@/features/shop/services/OrderService', () => ({
  OrderService: {
    updateOrderPaymentAuthority: vi.fn(),
  },
}))

const mockedPaymentService = vi.mocked(PaymentService)
const mockedOrderService = vi.mocked(OrderService)

const validInput = {
  amount: 3566461,
  description: 'خرید محصولات',
  orderId: 'order-123',
  email: 'test@example.com',
  mobile: '09121234567',
}

function createRequest(body: unknown) {
  return new NextRequest('http://localhost:3000/api/shop/payment/request', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

async function getJson(response: Response) {
  return response.json()
}

describe('POST /api/shop/payment/request', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 when amount is missing', async () => {
    const { amount, ...input } = validInput

    const request = createRequest(input)

    const response = await POST(request)

    const data = await getJson(response)

    expect(response.status).toBe(400)

    expect(data).toEqual({
      success: false,
      error: 'مبلغ پرداخت وارد نشده است',
    })

    expect(mockedPaymentService.requestPayment).not.toHaveBeenCalled()
    expect(
      mockedOrderService.updateOrderPaymentAuthority,
    ).not.toHaveBeenCalled()
  })

  it('should return 400 when description is missing', async () => {
    const { description, ...input } = validInput

    const request = createRequest(input)

    const response = await POST(request)

    const data = await getJson(response)

    expect(response.status).toBe(400)

    expect(data).toEqual({
      success: false,
      error: 'توضیحات پرداخت وارد نشده است',
    })

    expect(mockedPaymentService.requestPayment).not.toHaveBeenCalled()
  })

  it('should return 400 when orderId is missing', async () => {
    const { orderId, ...input } = validInput

    const request = createRequest(input)

    const response = await POST(request)

    const data = await getJson(response)

    expect(response.status).toBe(400)

    expect(data).toEqual({
      success: false,
      error: 'شناسه سفارش وارد نشده است',
    })

    expect(mockedPaymentService.requestPayment).not.toHaveBeenCalled()
  })

  it('should call PaymentService with correct payment data', async () => {
    mockedPaymentService.requestPayment.mockResolvedValue({
      success: true,
      authority: 'AUTH-123',
      paymentUrl: 'https://www.zarinpal.com/pg/StartPay/AUTH-123',
    })

    mockedOrderService.updateOrderPaymentAuthority.mockResolvedValue(undefined)

    const request = createRequest(validInput)

    const response = await POST(request)

    expect(response.status).toBe(200)

    expect(mockedPaymentService.requestPayment).toHaveBeenCalledTimes(1)

    expect(mockedPaymentService.requestPayment).toHaveBeenCalledWith({
      amount: 3566461,
      description: 'خرید محصولات',
      orderId: 'order-123',
      email: 'test@example.com',
      mobile: '09121234567',
    })
  })

  it('should convert amount to number before calling PaymentService', async () => {
    mockedPaymentService.requestPayment.mockResolvedValue({
      success: true,
      authority: 'AUTH-123',
      paymentUrl: 'https://www.zarinpal.com/pg/StartPay/AUTH-123',
    })

    mockedOrderService.updateOrderPaymentAuthority.mockResolvedValue(undefined)

    const request = createRequest({
      ...validInput,
      amount: '3566461',
    })

    const response = await POST(request)

    expect(response.status).toBe(200)

    expect(mockedPaymentService.requestPayment).toHaveBeenCalledWith({
      amount: 3566461,
      description: 'خرید محصولات',
      orderId: 'order-123',
      email: 'test@example.com',
      mobile: '09121234567',
    })
  })

  it('should return 400 when PaymentService fails', async () => {
    mockedPaymentService.requestPayment.mockResolvedValue({
      success: false,
      error: 'مبلغ بیشتر از سقف مجاز است',
    })

    const request = createRequest(validInput)

    const response = await POST(request)

    const data = await getJson(response)

    expect(response.status).toBe(400)

    expect(data).toEqual({
      success: false,
      error: 'مبلغ بیشتر از سقف مجاز است',
    })

    expect(mockedPaymentService.requestPayment).toHaveBeenCalledTimes(1)

    expect(
      mockedOrderService.updateOrderPaymentAuthority,
    ).not.toHaveBeenCalled()
  })

  it('should save payment authority when payment request succeeds', async () => {
    mockedPaymentService.requestPayment.mockResolvedValue({
      success: true,
      authority: 'AUTH-123',
      paymentUrl: 'https://www.zarinpal.com/pg/StartPay/AUTH-123',
    })

    mockedOrderService.updateOrderPaymentAuthority.mockResolvedValue(undefined)

    const request = createRequest(validInput)

    const response = await POST(request)

    expect(response.status).toBe(200)

    expect(
      mockedOrderService.updateOrderPaymentAuthority,
    ).toHaveBeenCalledTimes(1)

    expect(mockedOrderService.updateOrderPaymentAuthority).toHaveBeenCalledWith(
      {
        orderId: 'order-123',
        authority: 'AUTH-123',
      },
    )
  })

  it('should return payment data when payment request succeeds', async () => {
    mockedPaymentService.requestPayment.mockResolvedValue({
      success: true,
      authority: 'AUTH-123',
      paymentUrl: 'https://www.zarinpal.com/pg/StartPay/AUTH-123',
    })

    mockedOrderService.updateOrderPaymentAuthority.mockResolvedValue(undefined)

    const request = createRequest(validInput)

    const response = await POST(request)

    const data = await getJson(response)

    expect(response.status).toBe(200)

    expect(data).toEqual({
      success: true,
      authority: 'AUTH-123',
      paymentUrl: 'https://www.zarinpal.com/pg/StartPay/AUTH-123',
    })
  })

  it('should continue successfully when saving authority to database fails', async () => {
    mockedPaymentService.requestPayment.mockResolvedValue({
      success: true,
      authority: 'AUTH-123',
      paymentUrl: 'https://www.zarinpal.com/pg/StartPay/AUTH-123',
    })

    mockedOrderService.updateOrderPaymentAuthority.mockRejectedValue(
      new Error('Database connection failed'),
    )

    const request = createRequest(validInput)

    const response = await POST(request)

    const data = await getJson(response)

    expect(response.status).toBe(200)

    expect(data).toEqual({
      success: true,
      authority: 'AUTH-123',
      paymentUrl: 'https://www.zarinpal.com/pg/StartPay/AUTH-123',
    })

    expect(mockedOrderService.updateOrderPaymentAuthority).toHaveBeenCalledWith(
      {
        orderId: 'order-123',
        authority: 'AUTH-123',
      },
    )
  })

  it('should return 500 when request body is invalid JSON', async () => {
    const request = new NextRequest(
      'http://localhost:3000/api/shop/payment/request',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid-json',
      },
    )

    const response = await POST(request)

    const data = await getJson(response)

    expect(response.status).toBe(500)

    expect(data.success).toBe(false)
    expect(data.error).toBeTruthy()

    expect(mockedPaymentService.requestPayment).not.toHaveBeenCalled()
  })

  it('should return 500 when PaymentService throws unexpectedly', async () => {
    mockedPaymentService.requestPayment.mockRejectedValue(
      new Error('Unexpected payment service error'),
    )

    const request = createRequest(validInput)

    const response = await POST(request)

    const data = await getJson(response)

    expect(response.status).toBe(500)

    expect(data).toEqual({
      success: false,
      error: 'Unexpected payment service error',
    })

    expect(
      mockedOrderService.updateOrderPaymentAuthority,
    ).not.toHaveBeenCalled()
  })

  it('should pass optional email and mobile as undefined when they are not provided', async () => {
    mockedPaymentService.requestPayment.mockResolvedValue({
      success: true,
      authority: 'AUTH-123',
      paymentUrl: 'https://www.zarinpal.com/pg/StartPay/AUTH-123',
    })

    mockedOrderService.updateOrderPaymentAuthority.mockResolvedValue(undefined)

    const request = createRequest({
      amount: 3566461,
      description: 'خرید محصولات',
      orderId: 'order-123',
    })

    const response = await POST(request)

    expect(response.status).toBe(200)

    expect(mockedPaymentService.requestPayment).toHaveBeenCalledWith({
      amount: 3566461,
      description: 'خرید محصولات',
      orderId: 'order-123',
      email: undefined,
      mobile: undefined,
    })
  })
})
