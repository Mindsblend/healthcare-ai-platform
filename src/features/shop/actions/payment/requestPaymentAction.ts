import { PaymentRequestInput, PaymentRequestResponse } from '../../shop.types'

export async function requestPaymentAction(
  input: PaymentRequestInput,
): Promise<PaymentRequestResponse> {
  console.log('🟢 requestPaymentAction input:', JSON.stringify(input, null, 2))

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const url = `${baseUrl}/api/shop/payment/request`
  console.log('🟢 Fetching URL:', url)

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  console.log('🟢 Response status:', response.status)

  const data = await response.json()
  console.log('🟢 Response data:', JSON.stringify(data, null, 2))

  if (!response.ok) {
    return { success: false, error: data.error }
  }

  return data
}
