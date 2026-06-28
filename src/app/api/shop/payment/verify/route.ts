// app/api/shop/payment/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/features/shop/services/OrderService';
import { PaymentService } from '@/features/shop/services/PaymentService';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  console.log('🟢 [PAYMENT VERIFY] ========== START ==========');

  try {
    // 1. دریافت پارامترها
    const searchParams = req.nextUrl.searchParams;
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    
    console.log('🟢 [PAYMENT VERIFY] Authority:', authority);
    console.log('🟢 [PAYMENT VERIFY] Status:', status);

    // 2. بررسی لغو پرداخت
    if (status !== 'OK') {
      console.log('🟢 [PAYMENT VERIFY] Payment canceled by user');
      return NextResponse.redirect(
        new URL('/payment/failed?message=کاربر پرداخت را لغو کرد', req.url)
      );
    }

    // 3. اعتبارسنجی Authority
    if (!authority) {
      console.error('🟢 [PAYMENT VERIFY] ❌ Missing authority');
      return NextResponse.redirect(
        new URL('/payment/failed?message=شناسه پرداخت معتبر نیست', req.url)
      );
    }

    // 4. پیدا کردن سفارش
    console.log('🟢 [PAYMENT VERIFY] Finding order with authority:', authority);
    
    const order = await prisma.order.findFirst({
      where: { paymentAuthority: authority },
    });

    if (!order) {
      console.error('🟢 [PAYMENT VERIFY] ❌ Order not found');
      
      const allOrders = await prisma.order.findMany({
        select: { id: true, paymentAuthority: true, status: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      console.log('🟢 [PAYMENT VERIFY] Recent orders:', JSON.stringify(allOrders, null, 2));
      
      return NextResponse.redirect(
        new URL(`/payment/failed?message=سفارش با شناسه ${authority} یافت نشد`, req.url)
      );
    }

    console.log('🟢 [PAYMENT VERIFY] Order found:', {
      id: order.id,
      authority: order.paymentAuthority,
      status: order.status,
      totalPrice: order.totalPrice,
    });

    // 5. بررسی پرداخت قبلی
    if (order.status === 'PAID') {
      console.log('🟢 [PAYMENT VERIFY] Order already paid');
      return NextResponse.redirect(
        new URL(`/payment/success?refId=${order.paymentRefId || ''}&orderId=${order.id}`, req.url)
      );
    }

    // 6. تایید پرداخت با زرین‌پال
    console.log('🟢 [PAYMENT VERIFY] Calling PaymentService.verifyPayment...');
    console.log('🟢 [PAYMENT VERIFY] Amount:', order.totalPrice);
    
    const verifyResult = await PaymentService.verifyPayment({
      authority: authority,
      amount: order.totalPrice,
    });

    console.log('🟢 [PAYMENT VERIFY] Verify result:', JSON.stringify(verifyResult, null, 2));

    // 7. پردازش نتیجه
    if (verifyResult.success) {
      console.log('🟢 [PAYMENT VERIFY] ✅ Payment verified successfully');
      
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentRefId: verifyResult.refId?.toString() || '',
          paymentVerifiedAt: new Date(),
        },
      });

      if (order.cartId) {
        await prisma.cart.update({
          where: { id: order.cartId },
          data: { status: 'CHECKED_OUT' },
        });
      }
      
      return NextResponse.redirect(
        new URL(`/payment/success?refId=${verifyResult.refId}&orderId=${order.id}`, req.url)
      );
    } else {
      console.error('🟢 [PAYMENT VERIFY] ❌ Payment verification failed:', verifyResult.message);
      
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'FAILED',
          paymentErrorMessage: verifyResult.message || 'Payment verification failed',
        },
      });

      return NextResponse.redirect(
        new URL(`/payment/failed?message=${encodeURIComponent(verifyResult.message || 'پرداخت تأیید نشد')}`, req.url)
      );
    }
  } catch (error: any) {
    console.error('🟢 [PAYMENT VERIFY] ❌ Error:', error.message);
    if (error.stack) console.error('🟢 [PAYMENT VERIFY] Stack:', error.stack);
    
    return NextResponse.redirect(
      new URL('/payment/failed?message=خطا در تأیید پرداخت', req.url)
    );
  }
}