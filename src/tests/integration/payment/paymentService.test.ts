import axios from 'axios'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { PaymentService } from '@/features/shop/services/PaymentService'

describe('PaymentService integration', () => {
  const originalEnv = {
    merchantId: process.env.ZARINPAL_MERCHANT_ID,
    sandbox: process.env.ZARINPAL_SANDBOX,
    nextAuthUrl: process.env.NEXTAUTH_URL,
  }

  beforeEach(() => {
    vi.restoreAllMocks()
    process.env.ZARINPAL_MERCHANT_ID =
      'merchant-id-123456789012345678901234567890'
    process.env.ZARINPAL_SANDBOX = 'true'
    process.env.NEXTAUTH_URL = 'http://localhost:3000'
  })

  afterEach(() => {
    if (originalEnv.merchantId === undefined) {
      delete process.env.ZARINPAL_MERCHANT_ID
    } else {
      process.env.ZARINPAL_MERCHANT_ID = originalEnv.merchantId
    }

    if (originalEnv.sandbox === undefined) {
      delete process.env.ZARINPAL_SANDBOX
    } else {
      process.env.ZARINPAL_SANDBOX = originalEnv.sandbox
    }

    if (originalEnv.nextAuthUrl === undefined) {
      delete process.env.NEXTAUTH_URL
    } else {
      process.env.NEXTAUTH_URL = originalEnv.nextAuthUrl
    }
  })

  it('uses the sandbox request endpoint and sends the expected payment details', async () => {
    const postSpy = vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        data: {
          code: 100,
          authority: 'test-authority-123',
        },
      },
    })

    const result = await PaymentService.requestPayment({
      amount: 1250,
      description: 'Integration test payment',
      orderId: 'order-integration-123',
      email: 'test@example.com',
      mobile: '09120000000',
    })

    expect(postSpy).toHaveBeenCalledWith(
      'https://sandbox.zarinpal.com/pg/v4/payment/request.json',
      expect.objectContaining({
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        currency: 'IRT',
        amount: 1250,
        callback_url: 'http://localhost:3000/api/shop/payment/verify',
        description: 'Integration test payment - Order: order-integration-123',
        email: 'test@example.com',
        mobile: '09120000000',
      }),
      expect.objectContaining({ timeout: 30000 }),
    )

    expect(result).toEqual({
      success: true,
      authority: 'test-authority-123',
      paymentUrl: 'https://sandbox.zarinpal.com/pg/StartPay/test-authority-123',
    })
  })

  it('uses the sandbox verification endpoint and sends the expected verification details', async () => {
    const postSpy = vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        data: {
          code: 100,
          ref_id: 987654321,
        },
      },
    })

    const result = await PaymentService.verifyPayment({
      authority: 'test-authority-123',
      amount: 1250,
    })

    expect(postSpy).toHaveBeenCalledWith(
      'https://sandbox.zarinpal.com/pg/v4/payment/verify.json',
      {
        merchant_id: process.env.ZARINPAL_MERCHANT_ID,
        currency: 'IRT',
        amount: 1250,
        authority: 'test-authority-123',
      },
      expect.objectContaining({ timeout: 30000 }),
    )

    expect(result).toEqual({
      success: true,
      refId: 987654321,
      message: 'Payment verified successfully',
    })
  })

  it('returns a failure when the gateway rejects a payment request', async () => {
    vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        data: {
          code: -9,
          message: 'Invalid request',
        },
      },
    })

    const result = await PaymentService.requestPayment({
      amount: 1250,
      description: 'Integration test payment',
      orderId: 'order-integration-123',
    })

    expect(result).toEqual({
      success: false,
      error: 'خطای زرین‌پال: Invalid request',
    })
  })

  it('returns a failure when payment verification is rejected', async () => {
    vi.spyOn(axios, 'post').mockResolvedValueOnce({
      data: {
        data: {
          code: -21,
          message: 'Payment verification failed',
        },
      },
    })

    const result = await PaymentService.verifyPayment({
      authority: 'test-authority-123',
      amount: 1250,
    })

    expect(result).toEqual({
      success: false,
      message: 'خطای -21: Payment verification failed',
    })
  })

  it('does not call the gateway when the payment amount exceeds the maximum', async () => {
    const postSpy = vi.spyOn(axios, 'post')

    const result = await PaymentService.requestPayment({
      amount: 500_000_001,
      description: 'Integration test payment',
      orderId: 'order-integration-123',
    })

    expect(result.success).toBe(false)
    expect(postSpy).not.toHaveBeenCalled()
  })
})
