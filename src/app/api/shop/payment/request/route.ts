// app/api/shop/payment/request/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PaymentService } from '@/features/shop/services/PaymentService'
import { OrderService } from '@/features/shop/services/OrderService'

export async function POST(req: NextRequest) {
  console.log('🔴 [PAYMENT REQUEST] ========== START ==========')

  try {
    const body = await req.json()
    console.log(
      '🔴 [PAYMENT REQUEST] Request body:',
      JSON.stringify(body, null, 2),
    )

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

    console.log('🔴 [PAYMENT REQUEST] Amount in Toman:', amountInToman)

    console.log('REQUEST AMOUNT:', amountInToman)
    console.log('ORDER ID:', orderId)

    // Call payment service
    console.log('🔴 [PAYMENT REQUEST] Calling PaymentService...')
    const result = await PaymentService.requestPayment({
      amount: amountInToman, // Send in Toman
      description,
      orderId,
      email,
      mobile,
    })

    console.log(
      '🔴 [PAYMENT REQUEST] PaymentService result:',
      JSON.stringify(result, null, 2),
    )

    if (!result.success) {
      console.error('🔴 [PAYMENT REQUEST] Payment failed:', result.error)
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 },
      )
    }

    // Save authority to database
    try {
      console.log('🔴 [PAYMENT REQUEST] Saving authority to database...')
      await OrderService.updateOrderPaymentAuthority({
        orderId: orderId,
        authority: result.authority,
      })
      console.log('🔴 [PAYMENT REQUEST] Authority saved successfully')
    } catch (dbError) {
      console.error('🔴 [PAYMENT REQUEST] Failed to save authority:', dbError)
      // Continue anyway - user may have already paid
    }

    // Return success response
    console.log('🔴 [PAYMENT REQUEST] ✅ Payment request successful')
    console.log('🔴 [PAYMENT REQUEST] ========== END (SUCCESS) ==========')

    return NextResponse.json({
      success: true,
      authority: result.authority,
      paymentUrl: result.paymentUrl,
    })
  } catch (error: any) {
    console.error('🔴 [PAYMENT REQUEST] ========== ERROR ==========')
    console.error('🔴 [PAYMENT REQUEST] Error:', error.message)
    if (error.stack) console.error('🔴 [PAYMENT REQUEST] Stack:', error.stack)
    console.log('🔴 [PAYMENT REQUEST] ========== END (ERROR) ==========')

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'خطای داخلی سرور',
      },
      { status: 500 },
    )
  }
}
