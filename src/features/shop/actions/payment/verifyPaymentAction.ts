'use server'

import { PaymentVerifyInput, PaymentVerifyResponse } from '../../shop.types'

export async function verifyPaymentAction(
  input: PaymentVerifyInput,
): Promise<PaymentVerifyResponse> {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/shop/payment/verify`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      },
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: data?.error || data?.message || 'خطا در تایید پرداخت',
      }
    }

    return data
  } catch (error: unknown) {
    console.error('[verifyPaymentAction] Error:', error)

    return {
      success: false,
      message: error instanceof Error ? error.message : 'خطا در ارتباط با سرور',
    }
  }
}
