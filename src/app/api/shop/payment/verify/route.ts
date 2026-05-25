import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/features/shop/services/OrderService'

export async function GET(req: NextRequest) {
  try {
    // Get query parameters from Zarinpal redirect
    const searchParams = req.nextUrl.searchParams
    const authority = searchParams.get('Authority')
    const status = searchParams.get('Status')

    console.log('[Payment Verify] Authority:', authority)
    console.log('[Payment Verify] Status:', status)

    // Check if user canceled the payment
    if (status !== 'OK') {
      return NextResponse.redirect(
        new URL('/payment/failed?message=کاربر پرداخت را لغو کرد', req.url),
      )
    }

    // Validate authority
    if (!authority) {
      return NextResponse.redirect(
        new URL('/payment/failed?message=شناسه پرداخت معتبر نیست', req.url),
      )
    }

    // Find order by authority using OrderService
    const order = await OrderService.findOrderByAuthority(authority)

    if (!order) {
      console.error(
        '[Payment Verify] Order not found for authority:',
        authority,
      )
      return NextResponse.redirect(
        new URL('/payment/failed?message=سفارش یافت نشد', req.url),
      )
    }

    // Check if order is already PAID (prevent double verification)
    if (order.status === 'PAID') {
      console.log('[Payment Verify] Order already paid:', order.id)
      return NextResponse.redirect(
        new URL(
          `/payment/success?refId=${order.paymentRefId || ''}&orderId=${order.id}`,
          req.url,
        ),
      )
    }

    // Get merchant ID from environment
    const merchantId = process.env.ZARINPAL_MERCHANT_ID
    if (!merchantId) {
      console.error('[Payment Verify] Missing ZARINPAL_MERCHANT_ID')
      return NextResponse.redirect(
        new URL('/payment/failed?message=خطا در تنظیمات درگاه پرداخت', req.url),
      )
    }

    // Get amount from order (in Rials)
    const amount = order.totalPrice

    // Determine API URL (sandbox or production)
    const isSandbox = process.env.ZARINPAL_SANDBOX === 'true'
    const apiUrl = isSandbox
      ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json'
      : 'https://api.zarinpal.com/pg/v4/payment/verify.json'

    // Call Zarinpal verification API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: amount,
        authority: authority,
      }),
    })

    const result = await response.json()
    console.log('[Payment Verify] Zarinpal response:', result.data)

    // Handle verification result using OrderService
    if (result.data.code === 100) {
      // Payment verified successfully - Update order from PENDING to PAID
      await OrderService.verifyAndFinalizePayment({
        authority: authority,
        refId: result.data.ref_id.toString(),
        status: 'PAID',
      })

      // Redirect to success page
      return NextResponse.redirect(
        new URL(
          `/payment/success?refId=${result.data.ref_id}&orderId=${order.id}`,
          req.url,
        ),
      )
    } else {
      // Payment verification failed - Update order from PENDING to FAILED
      await OrderService.verifyAndFinalizePayment({
        authority: authority,
        refId: '',
        status: 'FAILED',
        errorMessage:
          result.data.message ||
          `Verification failed with code: ${result.data.code}`,
      })

      // Redirect to failure page
      return NextResponse.redirect(
        new URL(
          `/payment/failed?message=${encodeURIComponent(result.data.message || 'پرداخت تأیید نشد')}`,
          req.url,
        ),
      )
    }
  } catch (error) {
    console.error('[Payment Verify] Error:', error)
    return NextResponse.redirect(
      new URL('/payment/failed?message=خطا در تأیید پرداخت', req.url),
    )
  }
}
