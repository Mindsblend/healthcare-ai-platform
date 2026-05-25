'use server'

import { PaymentVerifyInput, PaymentVerifyResponse } from '../../shop.types'

export async function verifyPaymentAction(
  input: PaymentVerifyInput,
): Promise<PaymentVerifyResponse> {
  const response = await fetch(
    `${process.env.NEXTAUTH_URL}/api/shop/payment/verify`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
  )

  const data = await response.json()

  if (!response.ok) {
    return { success: false, message: data.error }
  }

  return data
}
