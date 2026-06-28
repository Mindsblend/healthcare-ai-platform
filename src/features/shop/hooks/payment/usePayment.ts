// features/shop/hooks/payment/usePayment.ts
import { useState } from 'react';
import { requestPaymentAction } from '../../actions/payment/requestPaymentAction';
import { PaymentRequestInput } from '../../shop.types';

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (input: PaymentRequestInput) => {
    console.log('🔵 [usePayment] Initiate payment with:', JSON.stringify(input, null, 2));

    setLoading(true);
    setError(null);

    try {
      console.log('🔵 [usePayment] Calling requestPaymentAction...');
      const result = await requestPaymentAction(input);
      console.log('🔵 [usePayment] Result:', JSON.stringify(result, null, 2));

      if (!result.success) {
        const errorMsg = result.error || 'Failed to initiate payment';
        console.error('🔵 [usePayment] Payment initiation failed:', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }

      if (!result.authority) {
        const errorMsg = 'No payment authority received';
        console.error('🔵 [usePayment]', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }

      console.log('🔵 [usePayment] Authority received:', result.authority);

      if (!result.paymentUrl) {
        const errorMsg = 'No payment URL received';
        console.error('🔵 [usePayment]', errorMsg);
        setError(errorMsg);
        setLoading(false);
        return { success: false, error: errorMsg };
      }

      console.log('🔵 [usePayment] ✅ Redirecting to payment gateway:', result.paymentUrl);
      window.location.replace(result.paymentUrl);
      
      return result;
    } catch (err: any) {
      console.error('🔵 [usePayment] Unexpected error:', err);
      const errorMsg = err.message || 'An unexpected error occurred';
      setError(errorMsg);
      setLoading(false);
      return { success: false, error: errorMsg };
    }
  };

  return { initiatePayment, loading, error };
}