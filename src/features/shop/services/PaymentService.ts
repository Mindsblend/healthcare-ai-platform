// services/PaymentService.ts
import axios from 'axios';
import { PaymentRequestInput, PaymentVerifyInput } from '../shop.types';

export class PaymentService {
  private static readonly MAX_AMOUNT = 5_000_000_000;
  private static readonly MIN_AMOUNT = 1_000;

  static async requestPayment(input: PaymentRequestInput) {
    const { amount, description, orderId, email, mobile } = input;

    console.log('🟡 [PaymentService] ========== START ==========');
    console.log('🟡 [PaymentService] Input:', JSON.stringify(input, null, 2));

    // اعتبارسنجی مبلغ
    if (amount > this.MAX_AMOUNT) {
      return {
        success: false,
        error: `مبلغ ${amount / 10} تومان بیشتر از سقف مجاز (${this.MAX_AMOUNT / 10} تومان) است`,
      };
    }

    if (amount < this.MIN_AMOUNT) {
      return {
        success: false,
        error: `مبلغ باید حداقل ${this.MIN_AMOUNT / 10} تومان باشد`,
      };
    }

    // ✅ آدرس بازگشت صحیح
    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/shop/payment/verify`;
    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    const isSandbox = process.env.ZARINPAL_SANDBOX === 'true';

    console.log('🟡 [PaymentService] Config:', {
      merchantId: merchantId?.substring(0, 8) + '...',
      isSandbox,
      callbackUrl,
    });

    if (!merchantId) {
      return {
        success: false,
        error: 'Merchant ID در تنظیمات وجود ندارد',
      };
    }

    const apiUrl = isSandbox
      ? 'https://sandbox.zarinpal.com/pg/v4/payment/request.json'
      : 'https://api.zarinpal.com/pg/v4/payment/request.json';

    const requestBody = {
      merchant_id: merchantId,
      amount,
      callback_url: callbackUrl,
      description: `${description} - Order: ${orderId}`,
      email: email || undefined,
      mobile: mobile || undefined,
    };

    console.log('🟡 [PaymentService] Request to Zarinpal:', JSON.stringify(requestBody, null, 2));

    try {
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      });

      console.log('🟡 [PaymentService] Response:', JSON.stringify(response.data, null, 2));

      const responseData = response.data;

      if (responseData?.data?.code === 100) {
        const authority = responseData.data.authority;
        
        const baseUrl = isSandbox
          ? 'https://sandbox.zarinpal.com/pg/StartPay'
          : 'https://www.zarinpal.com/pg/StartPay';
        
        const paymentUrl = `${baseUrl}/${authority}`;
        
        console.log('🟡 [PaymentService] ✅ Success:', {
          authority,
          paymentUrl,
          callbackUrl,
        });
        
        return {
          success: true,
          authority: authority,
          paymentUrl: paymentUrl,
        };
      }

      // بررسی خطاها
      if (responseData?.data?.code) {
        return {
          success: false,
          error: `خطای زرین‌پال: ${responseData.data.message || 'کد خطای ' + responseData.data.code}`,
        };
      }

      return {
        success: false,
        error: 'پاسخ نامعتبر از درگاه پرداخت',
      };
    } catch (error: any) {
      console.error('🟡 [PaymentService] Error:', error);
      
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data as any;
        return {
          success: false,
          error: responseData?.data?.message || responseData?.message || 'خطا در ارتباط با درگاه پرداخت',
        };
      }

      return {
        success: false,
        error: error.message || 'خطای ناشناخته',
      };
    }
  }

// services/PaymentService.ts

static async verifyPayment(input: PaymentVerifyInput) {
  const { authority, amount } = input;

  // ✅ خواندن مستقیم از process.env
  const merchantId = process.env.ZARINPAL_MERCHANT_ID
  const isSandbox = process.env.ZARINPAL_SANDBOX === 'true';

  console.log('🟡 [PaymentService] ========== VERIFY PAYMENT ==========');
  console.log('🟡 [PaymentService] Merchant ID (full):', merchantId);
  console.log('🟡 [PaymentService] Merchant ID (first 8):', merchantId?.substring(0, 8) + '...');
  console.log('🟡 [PaymentService] Merchant ID length:', merchantId?.length);
  console.log('🟡 [PaymentService] Is Sandbox:', isSandbox);
  console.log('🟡 [PaymentService] Authority:', authority);
  console.log('🟡 [PaymentService] Amount:', amount);

  // ✅ اعتبارسنجی Merchant ID
  if (!merchantId) {
    console.error('❌ [PaymentService] Merchant ID is missing!');
    return {
      success: false,
      message: 'Merchant ID در تنظیمات وجود ندارد',
    };
  }

  if (merchantId.length < 36) {
    console.error('❌ [PaymentService] Merchant ID is too short:', merchantId.length);
    return {
      success: false,
      message: `Merchant ID نامعتبر است. طول: ${merchantId.length}`,
    };
  }

  // ✅ انتخاب آدرس API درست
  const apiUrl = isSandbox
    ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json'
    : 'https://api.zarinpal.com/pg/v4/payment/verify.json';

  console.log('🟡 [PaymentService] API URL:', apiUrl);

  const requestBody = {
    merchant_id: merchantId, // ✅ استفاده از merchantId از environment
    amount: amount,
    authority: authority,
  };

  console.log('🟡 [PaymentService] Request body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });

    console.log('🟡 [PaymentService] Response status:', response.status);
    console.log('🟡 [PaymentService] Response data:', JSON.stringify(response.data, null, 2));

    const responseData = response.data;

    if (responseData?.data?.code === 100) {
      return {
        success: true,
        refId: responseData.data.ref_id,
        message: 'Payment verified successfully',
      };
    }

    const errorCode = responseData?.data?.code;
    const errorMessage = responseData?.data?.message || 'تایید پرداخت ناموفق';
    
    console.error('❌ [PaymentService] Zarinpal error:', { errorCode, errorMessage });
    
    return {
      success: false,
      message: `خطای ${errorCode}: ${errorMessage}`,
    };
  } catch (error: any) {
    console.error('❌ [PaymentService] Verify error:', error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data as any;

      console.error('❌ [PaymentService] HTTP Status:', status);
      console.error('❌ [PaymentService] Error response:', JSON.stringify(responseData, null, 2));

      if (status === 401) {
        return {
          success: false,
          message: `Merchant ID نامعتبر است. Merchant ID: ${merchantId?.substring(0, 8)}...`,
        };
      }

      return {
        success: false,
        message: responseData?.data?.message || responseData?.message || `خطای ${status}`,
      };
    }

    return {
      success: false,
      message: error.message || 'خطا در تایید پرداخت',
    };
  }
}
}