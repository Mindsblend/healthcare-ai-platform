// app/api/shop/payment/request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/features/shop/services/PaymentService'
import { OrderService } from '@/features/shop/services/OrderService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuthority({ requiredRole: 'USER' })
    const body = await req.json()
    const { description, orderId, email, mobile } = body

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'شناسه سفارش الزامی است' },
        { status: 400 },
      )
    }

    // خواندن سفارش از دیتابیس به عنوان تنها منبع معتبر قیمت
    const order = await OrderService.fetchOrderById({ id: orderId })

    if (!order || order.userId !== session.id) {
      return NextResponse.json(
        { success: false, error: 'سفارش یافت نشد یا متعلق به شما نیست' },
        { status: 404 },
      )
    }

    if (order.status === 'PAID') {
      return NextResponse.json(
        { success: false, error: 'این سفارش قبلاً پرداخت شده است' },
        { status: 400 },
      )
    }

    const amountInToman = Number(order.totalPrice)
    if (!Number.isFinite(amountInToman) || amountInToman <= 0) {
      return NextResponse.json(
        { success: false, error: 'مبلغ سفارش نامعتبر است' },
        { status: 400 },
      )
    }

    // درخواست به زرین‌پال
    const result = await PaymentService.requestPayment({
      amount: amountInToman,
      description: description || `پرداخت سفارش ${order.id}`,
      orderId: order.id,
      email: email || order.shippingEmail,
      mobile: mobile || order.shippingPhone,
    })

    if (!result.success || !result.authority) {
      console.error('[PAYMENT REQUEST] Payment failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'خطا در اتصال به درگاه پرداخت',
        },
        { status: 400 },
      )
    }

    // ذخیره حتمی Authority در دیتابیس قبل از هدایت کاربر به درگاه
    await OrderService.updateOrderPaymentAuthority({
      orderId: order.id,
      authority: result.authority,
    })

    return NextResponse.json({
      success: true,
      authority: result.authority,
      paymentUrl: result.paymentUrl,
    })
  } catch (error: any) {
    console.error('[PAYMENT REQUEST] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'خطای سرور در ایجاد درخواست پرداخت',
      },
      { status: 500 },
    )
  }
}
