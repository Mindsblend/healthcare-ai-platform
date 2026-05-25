import axios from 'axios'
import { PaymentRequestInput, PaymentVerifyInput } from '../shop.types'

export class PaymentService {
  static async requestPayment(input: PaymentRequestInput) {
    const { amount, description, orderId, email, mobile } = input

    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/payment/verify`
    const merchantId = process.env.ZARINPAL_MERCHANT_ID
    const isSandbox = process.env.ZARINPAL_SANDBOX === 'true'

    const apiUrl = isSandbox
      ? 'https://sandbox.zarinpal.com/pg/v4/payment/request.json'
      : 'https://api.zarinpal.com/pg/v4/payment/request.json'

    const response = await axios.post(apiUrl, {
      merchant_id: merchantId,
      amount,
      callback_url: callbackUrl,
      description: `${description} - Order: ${orderId}`,
      email: email || undefined,
      mobile: mobile || undefined,
    })

    const { data } = response

    if (data.code === 100) {
      return {
        success: true,
        authority: data.authority,
        paymentUrl: `https://www.zarinpal.com/pg/StartPay/${data.authority}`,
      }
    } else {
      return {
        success: false,
        error: `Payment request failed with code: ${data.code} - ${data.message}`,
      }
    }
  }

  static async verifyPayment(input: PaymentVerifyInput) {
    const { authority, amount } = input

    const merchantId = process.env.ZARINPAL_MERCHANT_ID
    const isSandbox = process.env.ZARINPAL_SANDBOX === 'true'

    const apiUrl = isSandbox
      ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json'
      : 'https://api.zarinpal.com/pg/v4/payment/verify.json'

    const response = await axios.post(apiUrl, {
      merchant_id: merchantId,
      amount,
      authority,
    })

    const { data } = response

    if (data.code === 100) {
      return {
        success: true,
        refId: data.ref_id,
        message: 'Payment verified successfully',
      }
    } else {
      return {
        success: false,
        message: `Payment verification failed with code: ${data.code} - ${data.message}`,
      }
    }
  }
}
