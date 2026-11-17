// features/shop/actions/payment/requestPaymentAction.ts
'use server'

import { headers } from 'next/headers' // <--- ۱. ایمپورت کردن headers برای دسترسی به کوکی‌ها
import { PaymentRequestInput, PaymentRequestResponse } from '../../shop.types'

export async function requestPaymentAction(
  input: PaymentRequestInput,
): Promise<PaymentRequestResponse> {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const url = `${baseUrl}/api/shop/payment/request`

  try {
    // ۲. گرفتن کوکی‌های درخواست کاربر جاری
    const cookieHeader = (await headers()).get('cookie') || ''

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader, // <--- ۳. ارسال کوکی به API Route برای حفظ احراز هویت
      },
      body: JSON.stringify(input),
    })

    const data = await response.json()

    if (!response.ok) {
      const errorMessage =
        data.error || data.message || `HTTP ${response.status}`
      return {
        success: false,
        error: errorMessage,
      }
    }

    if (!data.success) {
      return {
        success: false,
        error: data.error || 'Unknown error occurred',
      }
    }

    if (!data.authority) {
      return {
        success: false,
        error: 'پاسخ ناقص از سرور (Authority موجود نیست)',
      }
    }

    if (!data.paymentUrl) {
      return {
        success: false,
        error: 'پاسخ ناقص از سرور (PaymentUrl موجود نیست)',
      }
    }

    return {
      success: true,
      authority: data.authority,
      paymentUrl: data.paymentUrl,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'خطا در ارتباط با سرور',
    }
  }
}
