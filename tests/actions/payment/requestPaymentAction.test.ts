import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest'

import { requestPaymentAction } from '@/features/shop/actions/payment/requestPaymentAction'

describe('requestPaymentAction', () => {
  const originalFetch = global.fetch
  const originalNextAuthUrl = process.env.NEXTAUTH_URL

  const input = {
    amount: 3566461,
    description: 'سفارش تست',
    orderId: 'test-order-123',
    email: 'test@example.com',
    mobile: '09123456789',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    process.env.NEXTAUTH_URL = 'http://localhost:3000'

    global.fetch = vi.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch

    if (originalNextAuthUrl === undefined) {
      delete process.env.NEXTAUTH_URL
    } else {
      process.env.NEXTAUTH_URL = originalNextAuthUrl
    }
  })

  it('should request payment successfully', async () => {
    const responseData = {
      success: true,
      authority: 'S00000000000000000000000000000TEST',
      paymentUrl:
        'https://sandbox.zarinpal.com/pg/StartPay/S00000000000000000000000000000TEST',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await requestPaymentAction(input)

    expect(result).toEqual({
      success: true,
      authority: responseData.authority,
      paymentUrl: responseData.paymentUrl,
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/shop/payment/request',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      },
    )
  })

  it('should return error when API responds with HTTP error', async () => {
    const responseData = {
      error: 'خطا در درخواست پرداخت',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await requestPaymentAction(input)

    expect(result).toEqual({
      success: false,
      error: 'خطا در درخواست پرداخت',
    })
  })

  it('should use message when HTTP error does not contain error', async () => {
    const responseData = {
      message: 'Payment service unavailable',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 503,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await requestPaymentAction(input)

    expect(result).toEqual({
      success: false,
      error: 'Payment service unavailable',
    })
  })

  it('should use HTTP status when API error has no error or message', async () => {
    const responseData = {}

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await requestPaymentAction(input)

    expect(result).toEqual({
      success: false,
      error: 'HTTP 502',
    })
  })

  it('should return error when API logic fails', async () => {
    const responseData = {
      success: false,
      error: 'زرین‌پال درخواست پرداخت را رد کرد',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await requestPaymentAction(input)

    expect(result).toEqual({
      success: false,
      error: 'زرین‌پال درخواست پرداخت را رد کرد',
    })
  })

  it('should return default error when API logic fails without error message', async () => {
    const responseData = {
      success: false,
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await requestPaymentAction(input)

    expect(result).toEqual({
      success: false,
      error: 'Unknown error occurred',
    })
  })

  it('should reject incomplete response when authority is missing', async () => {
    const responseData = {
      success: true,
      paymentUrl:
        'https://sandbox.zarinpal.com/pg/StartPay/test-authority',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await requestPaymentAction(input)

    expect(result).toEqual({
      success: false,
      error: 'پاسخ ناقص از سرور (Authority موجود نیست)',
    })
  })

  it('should reject incomplete response when paymentUrl is missing', async () => {
    const responseData = {
      success: true,
      authority: 'TEST-AUTHORITY',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await requestPaymentAction(input)

    expect(result).toEqual({
      success: false,
      error: 'پاسخ ناقص از سرور (PaymentUrl موجود نیست)',
    })
  })

  it('should handle network errors gracefully', async () => {
    const originalFetch = global.fetch

    try {
      global.fetch = (() => {
        return Promise.reject(new Error('Network error'))
      }) as typeof fetch

      const result = await requestPaymentAction(input)

      expect(result).toEqual({
        success: false,
        error: 'Network error',
      })
    } finally {
      global.fetch = originalFetch
    }
  })

  it('should use default localhost URL when NEXTAUTH_URL is not defined', async () => {
    delete process.env.NEXTAUTH_URL

    const responseData = {
      success: true,
      authority: 'TEST-AUTHORITY',
      paymentUrl: 'https://sandbox.zarinpal.com/pg/StartPay/TEST-AUTHORITY',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    await requestPaymentAction(input)

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/shop/payment/request',
      expect.any(Object),
    )
  })
})