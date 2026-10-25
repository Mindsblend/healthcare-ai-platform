// app/api/shop/payment/request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/features/shop/services/PaymentService'
import { OrderService } from '@/features/shop/services/OrderService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { amount, description, orderId, email, mobile } = body

    // Validate required fields
    if (!amount) {
      return NextResponse.json(
        { success: false, error: 'مبلغ پرداخت وارد نشده است' },
        { status: 400 },
      )
    }

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'توضیحات پرداخت وارد نشده است' },
        { status: 400 },
      )
    }

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'شناسه سفارش وارد نشده است' },
        { status: 400 },
      )
    }

    // Amount is already in Toman - use as-is
    // PaymentService will add currency: "IRT" to the request
    const amountInToman = Number(amount)

    // Call payment service
    const result = await PaymentService.requestPayment({
      amount: amountInToman, // Send in Toman
      description,
      orderId,
      email,
      mobile,
    })

    if (!result.success) {
      console.error('🔴 [PAYMENT REQUEST] Payment failed:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
      )
    }

    // Save authority to database
    try {
      await OrderService.updateOrderPaymentAuthority({
        orderId: orderId,
        authority: result.authority,
      })
    } catch (dbError) {
      // Continue anyway - user may have already paid
    }

    // Return success response
    return NextResponse.json({
      success: true,
      authority: result.authority,
      paymentUrl: result.paymentUrl,
    })
  } catch (error: any) {
    if (error.stack) console.error('🔴 [PAYMENT REQUEST] Stack:', error.stack)

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'خطای داخلی سرور',
      },
      { status: 500 },
    )
  }
}
