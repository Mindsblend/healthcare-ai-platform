// app/api/shop/payment/request/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/features/shop/services/PaymentService';
import { OrderService } from '@/features/shop/services/OrderService';

export async function POST(req: NextRequest) {
  console.log('🔴 [PAYMENT REQUEST] ========== START ==========');

  try {
    const body = await req.json();
    console.log('🔴 [PAYMENT REQUEST] Request body:', JSON.stringify(body, null, 2));

    const { amount, description, orderId, email, mobile } = body;

    // اعتبارسنجی
    if (!amount) {
      return NextResponse.json(
        { success: false, error: 'مبلغ پرداخت وارد نشده است' },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { success: false, error: 'توضیحات پرداخت وارد نشده است' },
        { status: 400 }
      );
    }

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'شناسه سفارش وارد نشده است' },
        { status: 400 }
      );
    }

    // فراخوانی سرویس پرداخت
    console.log('🔴 [PAYMENT REQUEST] Calling PaymentService...');
    const result = await PaymentService.requestPayment({
      amount,
      description,
      orderId,
      email,
      mobile,
    });

    console.log('🔴 [PAYMENT REQUEST] PaymentService result:', JSON.stringify(result, null, 2));

    if (!result.success) {
      console.error('🔴 [PAYMENT REQUEST] Payment failed:', result.error);
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    // ذخیره Authority در دیتابیس
    try {
      console.log('🔴 [PAYMENT REQUEST] Saving authority to database...');
      await OrderService.updateOrderPaymentAuthority({
        orderId: orderId,
        authority: result.authority,
      });
      console.log('🔴 [PAYMENT REQUEST] Authority saved successfully');
    } catch (dbError) {
      console.error('🔴 [PAYMENT REQUEST] Failed to save authority:', dbError);
      // ادامه می‌دهیم چون ممکن است کاربر قبلاً پرداخت کرده باشد
    }

    // پاسخ موفق
    console.log('🔴 [PAYMENT REQUEST] ✅ Payment request successful');
    console.log('🔴 [PAYMENT REQUEST] ========== END (SUCCESS) ==========');

    return NextResponse.json({
      success: true,
      authority: result.authority,
      paymentUrl: result.paymentUrl,
    });
  } catch (error: any) {
    console.error('🔴 [PAYMENT REQUEST] ========== ERROR ==========');
    console.error('🔴 [PAYMENT REQUEST] Error:', error.message);
    if (error.stack) console.error('🔴 [PAYMENT REQUEST] Stack:', error.stack);
    console.log('🔴 [PAYMENT REQUEST] ========== END (ERROR) ==========');

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'خطای داخلی سرور',
      },
      { status: 500 }
    );
  }
}