// app/api/debug/merchant-check/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  const isSandbox = process.env.ZARINPAL_SANDBOX === 'true';

  console.log('🔍 [DEBUG] Merchant ID from env:', merchantId);
  console.log('🔍 [DEBUG] Is Sandbox:', isSandbox);

  return NextResponse.json({
    merchantId: merchantId,
    merchantIdLength: merchantId?.length || 0,
    isSandbox: isSandbox,
    apiUrl: isSandbox
      ? 'https://sandbox.zarinpal.com/pg/v4/payment/verify.json'
      : 'https://api.zarinpal.com/pg/v4/payment/verify.json',
    merchantIdPrefix: merchantId?.substring(0, 8) + '...',
  });
}