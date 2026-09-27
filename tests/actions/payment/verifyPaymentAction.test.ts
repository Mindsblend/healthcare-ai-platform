import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { verifyPaymentAction } from '@/features/shop/actions/payment/verifyPaymentAction'

describe('verifyPaymentAction', () => {
  const originalFetch = global.fetch

  const input = {
    authority: 'S00000000000000000000000000000vlel8w',
    amount: 3566461,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    global.fetch = vi.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  it('should verify payment successfully', async () => {
    const responseData = {
      success: true,
      refId: 123456789,
      message: 'Payment verified successfully',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await verifyPaymentAction(input)

    expect(result).toEqual(responseData)

    expect(global.fetch).toHaveBeenCalledTimes(1)

    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.NEXTAUTH_URL}/api/shop/payment/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      },
    )
  })

  it('should return failure when API responds with an error', async () => {
    const responseData = {
      error: 'تایید پرداخت ناموفق',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await verifyPaymentAction(input)

    expect(result).toEqual({
      success: false,
      message: 'تایید پرداخت ناموفق',
    })

    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  it('should send the correct payment data to the API', async () => {
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          refId: 999999,
          message: 'Payment verified successfully',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await verifyPaymentAction(input)

    const [, options] = vi.mocked(global.fetch).mock.calls[0]

    expect(options).toMatchObject({
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        authority: input.authority,
        amount: input.amount,
      }),
    })
  })

  it('should handle payment verification failure from the API', async () => {
    const responseData = {
      error: 'خطای زرین‌پال: پرداخت تایید نشد',
    }

    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(responseData), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await verifyPaymentAction(input)

    expect(result.success).toBe(false)

    expect(result.message).toBe('خطای زرین‌پال: پرداخت تایید نشد')
  })

  it('should handle network errors gracefully', async () => {
    const originalFetch = global.fetch

    try {
      global.fetch = (() => {
        return Promise.reject(new Error('Network error'))
      }) as typeof fetch

      const result = await verifyPaymentAction(input)

      expect(result).toEqual({
        success: false,
        message: 'Network error',
      })
    } finally {
      global.fetch = originalFetch
    }
  })
})
