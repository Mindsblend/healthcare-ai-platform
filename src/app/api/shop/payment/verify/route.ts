// app/api/shop/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/features/shop/services/PaymentService'
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

    // اگر کاربر از پرداخت انصراف داده یا پرداخت ناموفق بوده است
    if (status !== 'OK') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'CANCELED',
          paymentErrorMessage: 'انصراف توسط کاربر در درگاه پرداخت',
        },
      })
      return redirectWithError('پرداخت توسط شما لغو شد یا ناموفق بود')
    }

    const amountInToman = Number(order.totalPrice)

    // تایید تراکنش با زرین‌پال
    const verifyResult = await PaymentService.verifyPayment({
      authority,
      amount: amountInToman,
    })

    if (verifyResult.success) {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: 'PAID',
            paymentRefId: verifyResult.refId?.toString() || '',
            paymentVerifiedAt: new Date(),
          },
        })

        if (order.cartId) {
          await tx.cart.update({
            where: { id: order.cartId },
            data: { status: 'CHECKED_OUT' },
          })
        }
      })

      return NextResponse.redirect(
        new URL(
          `/payment/success?refId=${encodeURIComponent(String(verifyResult.refId || ''))}&orderId=${encodeURIComponent(order.id)}`,
          req.url,
        ),
      )
    } else {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'FAILED',
          paymentErrorMessage:
            verifyResult.message || 'Payment verification failed',
        },
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
