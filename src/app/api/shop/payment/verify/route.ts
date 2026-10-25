// app/api/shop/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/features/shop/services/OrderService'
import { PaymentService } from '@/features/shop/services/PaymentService'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    // 1. Get query parameters
    const searchParams = req.nextUrl.searchParams
    const authority = searchParams.get('Authority')
    const status = searchParams.get('Status')

    // 2. Check if payment was canceled by user
    if (status !== 'OK') {
      return NextResponse.redirect(
        new URL('/payment/failed?message=کاربر پرداخت را لغو کرد', req.url),
      )
    }

    // 3. Validate Authority
    if (!authority) {
      return NextResponse.redirect(
        new URL('/payment/failed?message=شناسه پرداخت معتبر نیست', req.url),
      )
    }

    // 4. Find the order
    const order = await prisma.order.findFirst({
      where: { paymentAuthority: authority },
    })

    if (!order) {
      const allOrders = await prisma.order.findMany({
        select: { id: true, paymentAuthority: true, status: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      })

      return NextResponse.redirect(
        new URL(
          `/payment/failed?message=سفارش با شناسه ${authority} یافت نشد`,
          req.url,
        ),
      )
    }

    // 5. Check if already paid
    if (order.status === 'PAID') {
      return NextResponse.redirect(
        new URL(
          `/payment/success?refId=${order.paymentRefId || ''}&orderId=${order.id}`,
          req.url,
        ),
      )
    }

    // 6. Amount is already in Toman - use as-is
    // PaymentService will add currency: "IRT" to the request
    const amountInToman = Number(order.totalPrice)

    // 7. Verify payment with Zarinpal
    const verifyResult = await PaymentService.verifyPayment({
      authority: authority,
      amount: amountInToman, // Send in Toman
    })

    // 8. Process the result
    if (verifyResult.success) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentRefId: verifyResult.refId?.toString() || '',
          paymentVerifiedAt: new Date(),
        },
      })

      if (order.cartId) {
        await prisma.cart.update({
          where: { id: order.cartId },
          data: { status: 'CHECKED_OUT' },
        })
      }

      return NextResponse.redirect(
        new URL(
          `/payment/success?refId=${verifyResult.refId}&orderId=${order.id}`,
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

      return NextResponse.redirect(
        new URL(
          `/payment/failed?message=${encodeURIComponent(verifyResult.message || 'پرداخت تأیید نشد')}`,
          req.url,
        ),
      )
    }
  } catch (error: any) {
    return NextResponse.redirect(
      new URL('/payment/failed?message=خطا در تأیید پرداخت', req.url),
    )
  }
}
