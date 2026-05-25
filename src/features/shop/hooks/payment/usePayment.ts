import { useState } from 'react'
import { requestPaymentAction } from '../../actions/payment/requestPaymentAction'
import { PaymentRequestInput } from '../../shop.types'

export function usePayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initiatePayment = async (input: PaymentRequestInput) => {
    console.log('🔵 initiatePayment called with:', input)
    setLoading(true)
    setError(null)

    try {
      console.log('🔵 Calling requestPaymentAction...')
      const result = await requestPaymentAction(input)

      console.log('🔵 requestPaymentAction result:', result)

      if (result.success && result.paymentUrl) {
        console.log('🔵 Redirecting to:', result.paymentUrl)
        window.location.href = result.paymentUrl
      } else {
        console.log('🔵 Payment initiation failed:', result.error)
        setError(result.error || 'Failed to initiate payment')
      }

      return result
    } catch (err: any) {
      console.error('🔵 Payment error:', err)
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }

  return { initiatePayment, loading, error }
}
