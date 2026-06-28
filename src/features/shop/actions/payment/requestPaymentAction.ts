// features/shop/actions/payment/requestPaymentAction.ts
'use server';

import { PaymentRequestInput, PaymentRequestResponse } from '../../shop.types';

export async function requestPaymentAction(
  input: PaymentRequestInput
): Promise<PaymentRequestResponse> {
  console.log('🟢 [requestPaymentAction] Input:', JSON.stringify(input, null, 2));

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = `${baseUrl}/api/shop/payment/request`;

  try {
    console.log('🟢 [requestPaymentAction] Calling API:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    console.log('🟢 [requestPaymentAction] Response status:', response.status);

    const data = await response.json();
    console.log('🟢 [requestPaymentAction] Response data:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      const errorMessage = data.error || data.message || `HTTP ${response.status}`;
      console.error('🟢 [requestPaymentAction] HTTP Error:', errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    }

    if (!data.success) {
      console.error('🟢 [requestPaymentAction] Logic Error:', data.error);
      return {
        success: false,
        error: data.error || 'Unknown error occurred',
      };
    }

    if (!data.authority) {
      console.error('🟢 [requestPaymentAction] Missing authority');
      return {
        success: false,
        error: 'پاسخ ناقص از سرور (Authority موجود نیست)',
      };
    }

    if (!data.paymentUrl) {
      console.error('🟢 [requestPaymentAction] Missing paymentUrl');
      return {
        success: false,
        error: 'پاسخ ناقص از سرور (PaymentUrl موجود نیست)',
      };
    }

    console.log('🟢 [requestPaymentAction] ✅ Success, authority:', data.authority);
    console.log('🟢 [requestPaymentAction] Redirecting to:', data.paymentUrl);
    
    return {
      success: true,
      authority: data.authority,
      paymentUrl: data.paymentUrl,
    };
  } catch (error: any) {
    console.error('🟢 [requestPaymentAction] Fetch error:', error.message);
    return {
      success: false,
      error: error.message || 'خطا در ارتباط با سرور',
    };
  }
}