import { beforeEach, describe, expect, it, vi } from 'vitest'
import axios from 'axios'

import { PaymentService } from '@/features/shop/services/PaymentService'

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios')

  return {
    ...actual,
    default: {
      ...actual.default,
      post: vi.fn(),
      isAxiosError: vi.fn(),
    },
  }
})

const mockedAxios = vi.mocked(axios)

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    process.env.NEXTAUTH_URL = 'http://localhost:3000'
    process.env.ZARINPAL_MERCHANT_ID =
      '12345678-1234-1234-1234-123456789012'
    process.env.ZARINPAL_SANDBOX = 'true'

    mockedAxios.isAxiosError.mockReturnValue(false)
  })

  // =========================================================
  // requestPayment
  // =========================================================

  describe('requestPayment', () => {
    const validInput = {
      amount: 100_000,
      description: 'خرید محصول',
      orderId: 'order-123',
      email: 'test@example.com',
      mobile: '09120000000',
    }

    it('should successfully request a payment', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 100,
            authority: 'S00000000000000000000000000000TEST',
          },
        },
      })

      const result = await PaymentService.requestPayment(validInput)

      expect(result).toEqual({
        success: true,
        authority: 'S00000000000000000000000000000TEST',
        paymentUrl:
          'https://sandbox.zarinpal.com/pg/StartPay/S00000000000000000000000000000TEST',
      })

      expect(mockedAxios.post).toHaveBeenCalledTimes(1)
    })

    it('should send the correct request body to Zarinpal', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 100,
            authority: 'AUTHORITY-123',
          },
        },
      })

      await PaymentService.requestPayment(validInput)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
        {
          merchant_id: '12345678-1234-1234-1234-123456789012',
          currency: 'IRT',
          amount: 100_000,
          callback_url:
            'http://localhost:3000/api/shop/payment/verify',
          description: 'خرید محصول - Order: order-123',
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
    })

    it('should round the payment amount', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 100,
            authority: 'AUTHORITY-ROUND',
          },
        },
      })

      await PaymentService.requestPayment({
        ...validInput,
        amount: 100_000.7,
      })

      const [, requestBody] = mockedAxios.post.mock.calls[0]

      expect(requestBody).toMatchObject({
        amount: 100_001,
        currency: 'IRT',
      })
    })

    it('should reject amount greater than the maximum allowed amount', async () => {
      const result = await PaymentService.requestPayment({
        ...validInput,
        amount: 500_000_001,
      })

      expect(result.success).toBe(false)

      expect(result.error).toContain('500,000,001')
      expect(result.error).toContain('500,000,000')

      expect(mockedAxios.post).not.toHaveBeenCalled()
    })

    it('should reject amount equal to maximum + rounding overflow', async () => {
      const result = await PaymentService.requestPayment({
        ...validInput,
        amount: 500_000_000.6,
      })

      expect(result.success).toBe(false)

      expect(mockedAxios.post).not.toHaveBeenCalled()
    })

    it('should reject amount lower than minimum allowed amount', async () => {
      const result = await PaymentService.requestPayment({
        ...validInput,
        amount: 99,
      })

      expect(result.success).toBe(false)

      expect(result.error).toContain('حداقل')
      expect(result.error).toContain('100')

      expect(mockedAxios.post).not.toHaveBeenCalled()
    })

    it('should reject amount equal to zero', async () => {
      const result = await PaymentService.requestPayment({
        ...validInput,
        amount: 0,
      })

      expect(result.success).toBe(false)

      expect(mockedAxios.post).not.toHaveBeenCalled()
    })

    it('should reject payment when merchant ID is missing', async () => {
      delete process.env.ZARINPAL_MERCHANT_ID

      const result = await PaymentService.requestPayment(validInput)

      expect(result).toEqual({
        success: false,
        error: 'Merchant ID در تنظیمات وجود ندارد',
      })

      expect(mockedAxios.post).not.toHaveBeenCalled()
    })

    it('should return Zarinpal error when response contains an error code', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: -9,
            message: 'Invalid merchant',
          },
        },
      })

      const result = await PaymentService.requestPayment(validInput)

      expect(result).toEqual({
        success: false,
        error: 'خطای زرین‌پال: Invalid merchant',
      })
    })

    it('should return a generic error when Zarinpal response is invalid', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {},
      })

      const result = await PaymentService.requestPayment(validInput)

      expect(result).toEqual({
        success: false,
        error: 'پاسخ نامعتبر از درگاه پرداخت',
      })
    })

    it('should handle Zarinpal response error without a message', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: -1,
          },
        },
      })

      const result = await PaymentService.requestPayment(validInput)

      expect(result).toEqual({
        success: false,
        error: 'خطای زرین‌پال: کد خطای -1',
      })
    })

    it('should handle Axios errors', async () => {
      const axiosError = {
        response: {
          status: 500,
          data: {
            data: {
              message: 'Zarinpal server error',
            },
          },
        },
      }

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const result = await PaymentService.requestPayment(validInput)

      expect(result).toEqual({
        success: false,
        error: 'Zarinpal server error',
      })
    })

    it('should handle Axios errors with top-level message', async () => {
      const axiosError = {
        response: {
          status: 500,
          data: {
            message: 'Payment gateway unavailable',
          },
        },
      }

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const result = await PaymentService.requestPayment(validInput)

      expect(result).toEqual({
        success: false,
        error: 'Payment gateway unavailable',
      })
    })

    it('should handle Axios errors without response data', async () => {
      const axiosError = {
        message: 'Network Error',
      }

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const result = await PaymentService.requestPayment(validInput)

      expect(result).toEqual({
        success: false,
        error: 'خطا در ارتباط با درگاه پرداخت',
      })
    })

    it('should handle normal JavaScript errors', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        new Error('Unexpected payment error'),
      )

      mockedAxios.isAxiosError.mockReturnValue(false)

      const result = await PaymentService.requestPayment(validInput)

      expect(result).toEqual({
        success: false,
        error: 'Unexpected payment error',
      })
    })

    it('should use production Zarinpal URL when sandbox is disabled', async () => {
      process.env.ZARINPAL_SANDBOX = 'false'

      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 100,
            authority: 'PROD-AUTHORITY',
          },
        },
      })

      const result = await PaymentService.requestPayment(validInput)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.zarinpal.com/pg/v4/payment/request.json',
        expect.any(Object),
        expect.any(Object),
      )

      expect(result).toEqual({
        success: true,
        authority: 'PROD-AUTHORITY',
        paymentUrl:
          'https://www.zarinpal.com/pg/StartPay/PROD-AUTHORITY',
      })
    })

    it('should allow optional email and mobile to be undefined', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 100,
            authority: 'AUTHORITY-NO-CONTACT',
          },
        },
      })

      await PaymentService.requestPayment({
        amount: 100_000,
        description: 'خرید محصول',
        orderId: 'order-456',
      })

      const [, requestBody] = mockedAxios.post.mock.calls[0]

      expect(requestBody).toMatchObject({
        amount: 100_000,
        email: undefined,
        mobile: undefined,
      })
    })
  })

  // =========================================================
  // verifyPayment
  // =========================================================

  describe('verifyPayment', () => {
    const validInput = {
      authority: 'S00000000000000000000000000000VERIFY',
      amount: 100_000,
    }

    it('should successfully verify a payment', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 100,
            ref_id: 123456789,
          },
        },
      })

      const result = await PaymentService.verifyPayment(validInput)

      expect(result).toEqual({
        success: true,
        refId: 123456789,
        message: 'Payment verified successfully',
      })
    })

    it('should send the correct verification request', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 100,
            ref_id: 987654321,
          },
        },
      })

      await PaymentService.verifyPayment(validInput)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
        {
          merchant_id: '12345678-1234-1234-1234-123456789012',
          currency: 'IRT',
          amount: 100_000,
          authority: 'S00000000000000000000000000000VERIFY',
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

    it('should round the verification amount', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 100,
            ref_id: 111222333,
          },
        },
      })

      await PaymentService.verifyPayment({
        ...validInput,
        amount: 100_000.8,
      })

      const [, requestBody] = mockedAxios.post.mock.calls[0]

      expect(requestBody).toMatchObject({
        amount: 100_001,
        currency: 'IRT',
      })
    })

    it('should reject verification when merchant ID is missing', async () => {
      delete process.env.ZARINPAL_MERCHANT_ID

      const result = await PaymentService.verifyPayment(validInput)

      expect(result).toEqual({
        success: false,
        message: 'Merchant ID در تنظیمات وجود ندارد',
      })

      expect(mockedAxios.post).not.toHaveBeenCalled()
    })

    it('should reject verification when merchant ID is too short', async () => {
      process.env.ZARINPAL_MERCHANT_ID = 'short-id'

      const result = await PaymentService.verifyPayment(validInput)

      expect(result.success).toBe(false)
      expect(result.message).toContain('Merchant ID نامعتبر است')
      expect(result.message).toContain('8')

      expect(mockedAxios.post).not.toHaveBeenCalled()
    })

    it('should return Zarinpal verification error', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: -22,
            message: 'Transaction not found',
          },
        },
      })

      const result = await PaymentService.verifyPayment(validInput)

      expect(result).toEqual({
        success: false,
        message: 'خطای -22: Transaction not found',
      })
    })

    it('should handle verification error without message', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: -22,
          },
        },
      })

      const result = await PaymentService.verifyPayment(validInput)

      expect(result).toEqual({
        success: false,
        message: 'خطای -22: تایید پرداخت ناموفق',
      })
    })

    it('should handle Axios 401 error', async () => {
      const axiosError = {
        response: {
          status: 401,
          data: {
            data: {
              message: 'Unauthorized',
            },
          },
        },
      }

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const result = await PaymentService.verifyPayment(validInput)

      expect(result).toEqual({
        success: false,
        message:
          'Merchant ID نامعتبر است. Merchant ID: 12345678...',
      })
    })

    it('should handle other Axios errors', async () => {
      const axiosError = {
        response: {
          status: 500,
          data: {
            data: {
              message: 'Internal server error',
            },
          },
        },
      }

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const result = await PaymentService.verifyPayment(validInput)

      expect(result).toEqual({
        success: false,
        message: 'Internal server error',
      })
    })

    it('should handle Axios error with top-level message', async () => {
      const axiosError = {
        response: {
          status: 400,
          data: {
            message: 'Bad request',
          },
        },
      }

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const result = await PaymentService.verifyPayment(validInput)

      expect(result).toEqual({
        success: false,
        message: 'Bad request',
      })
    })

    it('should handle Axios error without response data', async () => {
      const axiosError = {
        response: {
          status: 503,
          data: {},
        },
      }

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      mockedAxios.isAxiosError.mockReturnValue(true)

      const result = await PaymentService.verifyPayment(validInput)

      expect(result).toEqual({
        success: false,
        message: 'خطای 503',
      })
    })

    it('should handle normal JavaScript errors during verification', async () => {
      mockedAxios.post.mockRejectedValueOnce(
        new Error('Unexpected verification error'),
      )

      mockedAxios.isAxiosError.mockReturnValue(false)

      const result = await PaymentService.verifyPayment(validInput)

      expect(result).toEqual({
        success: false,
        message: 'Unexpected verification error',
      })
    })

    it('should use production verification URL when sandbox is disabled', async () => {
      process.env.ZARINPAL_SANDBOX = 'false'

      mockedAxios.post.mockResolvedValueOnce({
        status: 200,
        data: {
          data: {
            code: 100,
            ref_id: 555666777,
          },
        },
      })

      const result = await PaymentService.verifyPayment(validInput)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'https://api.zarinpal.com/pg/v4/payment/verify.json',
        expect.any(Object),
        expect.any(Object),
      )

      expect(result).toEqual({
        success: true,
        refId: 555666777,
        message: 'Payment verified successfully',
      })
    })
  })
})