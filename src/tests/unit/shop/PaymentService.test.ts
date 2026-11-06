import { PaymentService } from '@/features/shop/services/PaymentService'
import axios from 'axios'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
    isAxiosError: vi.fn(),
  },
}))

describe('PaymentService.requestPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an error when amount exceeds the maximum allowed', async () => {
    const input = {
      amount: 500_000_001,
      description: 'Test payment',
      orderId: 'order-123',
      email: 'test@example.com',
      mobile: '09120000000',
    }

    const result = await PaymentService.requestPayment(input)

    expect(result).toEqual({
      success: false,
      error: 'مبلغ 500,000,001 تومان بیشتر از سقف مجاز (500,000,000 تومان) است',
    })

    expect(axios.post).not.toHaveBeenCalled()
  })

  it('returns an error when amount is below the minimum allowed', async () => {
    const input = {
      amount: 99,
      description: 'Test payment',
      orderId: 'order-123',
      email: 'test@example.com',
      mobile: '09120000000',
    }

    const result = await PaymentService.requestPayment(input)

    expect(result).toEqual({
      success: false,
      error: 'مبلغ باید حداقل 100 تومان باشد',
    })

    expect(axios.post).not.toHaveBeenCalled()
  })

  it('returns an error when merchant ID is missing', async () => {
    const originalMerchantId = process.env.ZARINPAL_MERCHANT_ID
    delete process.env.ZARINPAL_MERCHANT_ID

    const input = {
      amount: 1000,
      description: 'Test payment',
      orderId: 'order-123',
      email: 'test@example.com',
      mobile: '09120000000',
    }

    const result = await PaymentService.requestPayment(input)

    expect(result).toEqual({
      success: false,
      error: 'Merchant ID در تنظیمات وجود ندارد',
    })

    expect(axios.post).not.toHaveBeenCalled()

    process.env.ZARINPAL_MERCHANT_ID = originalMerchantId
  })

  it('creates a payment request successfully', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-id-123'
    process.env.ZARINPAL_SANDBOX = 'true'
    process.env.NEXTAUTH_URL = 'https://example.com'

    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        data: {
          code: 100,
          authority: 'A00000000000000000000000000123456789',
        },
      },
    } as any)

    const input = {
      amount: 1250.6,
      description: 'Test payment',
      orderId: 'order-123',
      email: 'test@example.com',
      mobile: '09120000000',
    }

    const result = await PaymentService.requestPayment(input)

    expect(axios.post).toHaveBeenCalledWith(
      'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
      {
        merchant_id: 'merchant-id-123',
        currency: 'IRT',
        amount: 1251,
        callback_url: 'https://example.com/api/shop/payment/verify',
        description: 'Test payment - Order: order-123',
        email: 'test@example.com',
        mobile: '09120000000',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 30000,
      },
    )

    expect(result).toEqual({
      success: true,
      authority: 'A00000000000000000000000000123456789',
      paymentUrl:
        'https://sandbox.zarinpal.com/pg/StartPay/A00000000000000000000000000123456789',
    })
  })

  it('returns the ZarinPal error when payment request is rejected', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-id-123'
    process.env.ZARINPAL_SANDBOX = 'true'
    process.env.NEXTAUTH_URL = 'https://example.com'

    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        data: {
          code: -9,
          message: 'Amount is invalid',
        },
      },
    } as any)

    const input = {
      amount: 1000,
      description: 'Test payment',
      orderId: 'order-123',
    }

    const result = await PaymentService.requestPayment(input)

    expect(result).toEqual({
      success: false,
      error: 'خطای زرین‌پال: Amount is invalid',
    })
  })

  it('returns the gateway error message when the request fails with an Axios error', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-id-123'
    process.env.ZARINPAL_SANDBOX = 'true'
    process.env.NEXTAUTH_URL = 'https://example.com'

    const error = {
      response: {
        data: {
          data: {
            message: 'Merchant is not active',
          },
        },
      },
    }

    vi.mocked(axios.post).mockRejectedValueOnce(error)
    vi.mocked(axios.isAxiosError).mockReturnValueOnce(true)

    const input = {
      amount: 1000,
      description: 'Test payment',
      orderId: 'order-123',
    }

    const result = await PaymentService.requestPayment(input)

    expect(result).toEqual({
      success: false,
      error: 'Merchant is not active',
    })
  })

  it('returns a generic gateway error when an Axios error has no message', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-id-123'
    process.env.ZARINPAL_SANDBOX = 'true'
    process.env.NEXTAUTH_URL = 'https://example.com'

    vi.mocked(axios.post).mockRejectedValueOnce({
      response: {
        data: {},
      },
    })

    vi.mocked(axios.isAxiosError).mockReturnValueOnce(true)

    const result = await PaymentService.requestPayment({
      amount: 1000,
      description: 'Test payment',
      orderId: 'order-123',
    })

    expect(result).toEqual({
      success: false,
      error: 'خطا در ارتباط با درگاه پرداخت',
    })
  })

  it('returns the exception message for a non-Axios error', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-id-123'
    process.env.ZARINPAL_SANDBOX = 'true'
    process.env.NEXTAUTH_URL = 'https://example.com'

    vi.mocked(axios.post).mockRejectedValueOnce(
      new Error('Unexpected internal failure'),
    )

    vi.mocked(axios.isAxiosError).mockReturnValueOnce(false)

    const result = await PaymentService.requestPayment({
      amount: 1000,
      description: 'Test payment',
      orderId: 'order-123',
    })

    expect(result).toEqual({
      success: false,
      error: 'Unexpected internal failure',
    })
  })

  it('accepts an amount that rounds up to the minimum allowed amount', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'merchant-id-123'
    process.env.ZARINPAL_SANDBOX = 'true'
    process.env.NEXTAUTH_URL = 'https://example.com'

    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        data: {
          code: 100,
          authority: 'A00000000000000000000000000123456789',
        },
      },
    })

    const result = await PaymentService.requestPayment({
      amount: 99.6,
      description: 'Test payment',
      orderId: 'order-123',
    })

    expect(axios.post).toHaveBeenCalledWith(
      'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
      expect.objectContaining({
        amount: 100,
      }),
      expect.any(Object),
    )

    expect(result).toEqual({
      success: true,
      authority: 'A00000000000000000000000000123456789',
      paymentUrl:
        'https://sandbox.zarinpal.com/pg/StartPay/A00000000000000000000000000123456789',
    })
  })
})

describe('PaymentService.verifyPayment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an error when merchant ID is missing', async () => {
    delete process.env.ZARINPAL_MERCHANT_ID

    const result = await PaymentService.verifyPayment({
      authority: 'A00000000000000000000000000123456789',
      amount: 1000,
    })

    expect(result).toEqual({
      success: false,
      message: 'Merchant ID در تنظیمات وجود ندارد',
    })

    expect(axios.post).not.toHaveBeenCalled()
  })

  it('returns an error when merchant ID is shorter than 36 characters', async () => {
    process.env.ZARINPAL_MERCHANT_ID = 'short-merchant-id'

    const result = await PaymentService.verifyPayment({
      authority: 'A00000000000000000000000000123456789',
      amount: 1000,
    })

    expect(result).toEqual({
      success: false,
      message: 'Merchant ID نامعتبر است. طول: 17',
    })

    expect(axios.post).not.toHaveBeenCalled()
  })

  it('returns success when payment verification succeeds', async () => {
    process.env.ZARINPAL_MERCHANT_ID =
      'merchant-id-123456789012345678901234567890'

    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        data: {
          code: 100,
          ref_id: 123456789,
        },
      },
    })

    const result = await PaymentService.verifyPayment({
      authority: 'A00000000000000000000000000123456789',
      amount: 1000,
    })

    expect(result).toEqual({
      success: true,
      refId: 123456789,
      message: 'Payment verified successfully',
    })

    expect(axios.post).toHaveBeenCalledWith(
      'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
      {
        merchant_id: 'merchant-id-123456789012345678901234567890',
        currency: 'IRT',
        amount: 1000,
        authority: 'A00000000000000000000000000123456789',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        timeout: 30000,
      },
    )
  })

  it('returns the gateway error when payment verification fails', async () => {
    process.env.ZARINPAL_MERCHANT_ID =
      'merchant-id-123456789012345678901234567890'

    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        data: {
          code: -21,
          message: 'درخواست تایید پرداخت ناموفق است',
        },
      },
    })

    const result = await PaymentService.verifyPayment({
      authority: 'A00000000000000000000000000123456789',
      amount: 1000,
    })

    expect(result).toEqual({
      success: false,
      message: 'خطای -21: درخواست تایید پرداخت ناموفق است',
    })
  })

  it('returns a merchant ID error when ZarinPal responds with 401', async () => {
    process.env.ZARINPAL_MERCHANT_ID =
      'merchant-id-123456789012345678901234567890'

    const error = {
      response: {
        status: 401,
        data: {
          message: 'Unauthorized',
        },
      },
    }

    vi.mocked(axios.isAxiosError).mockReturnValueOnce(true)
    vi.mocked(axios.post).mockRejectedValueOnce(error)

    const result = await PaymentService.verifyPayment({
      authority: 'A00000000000000000000000000123456789',
      amount: 1000,
    })

    expect(result).toEqual({
      success: false,
      message: 'Merchant ID نامعتبر است. Merchant ID: merchant...',
    })
  })

  it('returns the gateway message for a non-401 Axios error', async () => {
    process.env.ZARINPAL_MERCHANT_ID =
      'merchant-id-123456789012345678901234567890'

    const error = {
      response: {
        status: 500,
        data: {
          data: {
            message: 'خطای داخلی درگاه',
          },
        },
      },
    }

    vi.mocked(axios.isAxiosError).mockReturnValueOnce(true)
    vi.mocked(axios.post).mockRejectedValueOnce(error)

    const result = await PaymentService.verifyPayment({
      authority: 'A00000000000000000000000000123456789',
      amount: 1000,
    })

    expect(result).toEqual({
      success: false,
      message: 'خطای داخلی درگاه',
    })
  })

  it('returns the HTTP status when an Axios error has no message', async () => {
    process.env.ZARINPAL_MERCHANT_ID =
      'merchant-id-123456789012345678901234567890'

    const error = {
      response: {
        status: 503,
        data: {},
      },
    }

    vi.mocked(axios.isAxiosError).mockReturnValueOnce(true)
    vi.mocked(axios.post).mockRejectedValueOnce(error)

    const result = await PaymentService.verifyPayment({
      authority: 'A00000000000000000000000000123456789',
      amount: 1000,
    })

    expect(result).toEqual({
      success: false,
      message: 'خطای 503',
    })
  })

  it('returns the exception message for a non-Axios error', async () => {
    process.env.ZARINPAL_MERCHANT_ID =
      'merchant-id-123456789012345678901234567890'

    vi.mocked(axios.isAxiosError).mockReturnValueOnce(false)
    vi.mocked(axios.post).mockRejectedValueOnce(
      new Error('Unexpected internal failure'),
    )

    const result = await PaymentService.verifyPayment({
      authority: 'A00000000000000000000000000123456789',
      amount: 1000,
    })

    expect(result).toEqual({
      success: false,
      message: 'Unexpected internal failure',
    })
  })
})
