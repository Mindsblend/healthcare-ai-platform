// app/api/shop/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/features/shop/services/PaymentService'
import { OrderService } from '@/features/shop/services/OrderService'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const redirectWithError = (msg: string) =>
    NextResponse.redirect(
      new URL(`/payment/failed?message=${encodeURIComponent(msg)}`, req.url),
    )

  try {
    const searchParams = req.nextUrl.searchParams
    const authority = searchParams.get('Authority')
    const status = searchParams.get('Status')

    if (!authority) {
      return redirectWithError('کد پیگیری درگاه (Authority) یافت نشد')
    }

    // Check status first - if not OK, redirect without DB query
    if (status !== 'OK') {
      return redirectWithError('پرداخت توسط شما لغو شد یا ناموفق بود')
    }

    const order = await prisma.order.findFirst({
      where: { paymentAuthority: authority },
    })

    if (!order) {
      return redirectWithError(`سفارشی با کد تراکنش ${authority} یافت نشد`)
    }

    // اگر قبلاً پرداخت و تایید شده است
    if (order.status === 'PAID') {
      return NextResponse.redirect(
        new URL(
          `/payment/success?refId=${encodeURIComponent(order.paymentRefId || '')}&orderId=${encodeURIComponent(order.id)}`,
          req.url,
        ),
      )
    }

    const amountInToman = Number(order.totalPrice)

    // تایید تراکنش با زرین‌پال
    const verifyResult = await PaymentService.verifyPayment({
      authority,
      amount: amountInToman,
    })

    if (verifyResult.success) {
      await OrderService.finalizePayment({
        orderId: order.id,
        status: 'PAID',
        refId: verifyResult.refId?.toString() || '',
      })

      return NextResponse.redirect(
        new URL(
          `/payment/success?refId=${encodeURIComponent(String(verifyResult.refId || ''))}&orderId=${encodeURIComponent(order.id)}`,
          req.url,
        ),
      )
    } else {
      await OrderService.finalizePayment({
        orderId: order.id,
        status: 'FAILED',
        errorMessage: verifyResult.message || 'Payment verification failed',
      })

      return redirectWithError(
        verifyResult.message || 'تایید تراکنش از سمت بانک ناموفق بود',
      )
    }
  } catch (error: any) {
    console.error('[PAYMENT VERIFY] Error:', error)
    return redirectWithError('خطای سیستمی در بررسی وضعیت پرداخت')
  }
}
