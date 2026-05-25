// app/api/payment/request/route.ts

import { NextRequest, NextResponse } from 'next/server'
import {
  getSession,
  requireAuthority,
} from '@/features/auth/services/sessionService'
import { OrderService } from '@/features/shop/services/OrderService'

export async function POST(req: NextRequest) {
  console.log('🔴 [PAYMENT REQUEST] ========== START ==========')

  // Check session directly first
  const session = await getSession()
  console.log(
    '🔴 [PAYMENT REQUEST] getServerSession result:',
    JSON.stringify(session, null, 2),
  )
  console.log('🔴 [PAYMENT REQUEST] Session exists?', !!session)
  console.log('🔴 [PAYMENT REQUEST] Session user:', session?.id)

  // Check cookies
  const cookies = req.cookies.getAll()
  console.log(
    '🔴 [PAYMENT REQUEST] Cookies present:',
    cookies.map((c) => c.name),
  )

  try {
    console.log(
      '🔴 [PAYMENT REQUEST] Step 1: Authenticating user with requireAuthority...',
    )
    const authSession = await requireAuthority({ requiredRole: 'USER' })
    console.log('🔴 [PAYMENT REQUEST] Auth successful:', authSession.id)
    const session = await requireAuthority({ requiredRole: 'USER' })
    console.log('🔴 [PAYMENT REQUEST] User authenticated:', {
      userId: session.id,
      email: session.email,
      phone: session.phone,
    })

    console.log('🔴 [PAYMENT REQUEST] Step 2: Parsing request body...')
    const body = await req.json()
    console.log(
      '🔴 [PAYMENT REQUEST] Request body:',
      JSON.stringify(body, null, 2),
    )

    const { amount, description, orderId, email, mobile } = body

    console.log('🔴 [PAYMENT REQUEST] Step 3: Validating fields...')
    console.log('🔴 [PAYMENT REQUEST] amount:', amount, 'type:', typeof amount)
    console.log('🔴 [PAYMENT REQUEST] description:', description)
    console.log('🔴 [PAYMENT REQUEST] orderId:', orderId)
    console.log('🔴 [PAYMENT REQUEST] email:', email)
    console.log('🔴 [PAYMENT REQUEST] mobile:', mobile)

    // Validate required fields
    if (!amount || !description || !orderId) {
      console.error('🔴 [PAYMENT REQUEST] Validation failed - missing fields')
      return NextResponse.json(
        { error: 'Missing required fields: amount, description, orderId' },
        { status: 400 },
      )
    }
    console.log('🔴 [PAYMENT REQUEST] Validation passed')

    console.log('🔴 [PAYMENT REQUEST] Step 4: Getting merchant ID...')
    const merchantId = process.env.ZARINPAL_MERCHANT_ID
    if (!merchantId) {
      console.error('🔴 [PAYMENT REQUEST] Missing ZARINPAL_MERCHANT_ID')
      return NextResponse.json(
        { error: 'Payment configuration error' },
        { status: 500 },
      )
    }
    console.log(
      '🔴 [PAYMENT REQUEST] Merchant ID found:',
      merchantId.substring(0, 8) + '...',
    )

    const isSandbox = process.env.ZARINPAL_SANDBOX === 'true'
    console.log('🔴 [PAYMENT REQUEST] isSandbox:', isSandbox)

    const apiUrl = isSandbox
      ? 'https://sandbox.zarinpal.com/pg/v4/payment/request.json'
      : 'https://api.zarinpal.com/pg/v4/payment/request.json'
    console.log('🔴 [PAYMENT REQUEST] Zarinpal API URL:', apiUrl)

    const callbackUrl = `${process.env.NEXTAUTH_URL}/api/payment/verify`
    console.log('🔴 [PAYMENT REQUEST] Callback URL:', callbackUrl)

    const requestBody = {
      merchant_id: merchantId,
      amount: amount,
      callback_url: callbackUrl,
      description: `${description} - Order: ${orderId}`,
      email: email || session.email || undefined,
      mobile: mobile || session.phone || undefined,
    }
    console.log(
      '🔴 [PAYMENT REQUEST] Request to Zarinpal:',
      JSON.stringify(requestBody, null, 2),
    )

    console.log('🔴 [PAYMENT REQUEST] Step 5: Calling Zarinpal API...')
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    })

    console.log(
      '🔴 [PAYMENT REQUEST] Zarinpal response status:',
      response.status,
    )

    const result = await response.json()
    console.log(
      '🔴 [PAYMENT REQUEST] Zarinpal response data:',
      JSON.stringify(result, null, 2),
    )

    if (result.data.code === 100) {
      console.log('🔴 [PAYMENT REQUEST] Step 6: Payment request successful!')
      console.log('🔴 [PAYMENT REQUEST] Authority:', result.data.authority)

      console.log('🔴 [PAYMENT REQUEST] Step 7: Storing authority in order...')
      try {
        await OrderService.updateOrderPaymentAuthority({
          orderId: orderId,
          authority: result.data.authority,
        })
        console.log(
          '🔴 [PAYMENT REQUEST] Authority stored successfully for order:',
          orderId,
        )
      } catch (dbError) {
        console.error(
          '🔴 [PAYMENT REQUEST] Failed to store authority:',
          dbError,
        )
      }

      const responseData = {
        success: true,
        authority: result.data.authority,
        paymentUrl: `https://www.zarinpal.com/pg/StartPay/${result.data.authority}`,
      }

      console.log(
        '🔴 [PAYMENT REQUEST] Returning success response:',
        responseData,
      )
      console.log('🔴 [PAYMENT REQUEST] ========== END ==========')
      return NextResponse.json(responseData)
    } else {
      console.error(
        '🔴 [PAYMENT REQUEST] Payment request failed with code:',
        result.data.code,
      )
      console.error('🔴 [PAYMENT REQUEST] Error message:', result.data.message)
      console.log('🔴 [PAYMENT REQUEST] ========== END (FAILED) ==========')
      return NextResponse.json(
        {
          success: false,
          error: `Payment request failed with code: ${result.data.code}`,
          message: result.data.message,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error('🔴 [PAYMENT REQUEST] ========== ERROR ==========')
    console.error('🔴 [PAYMENT REQUEST] Error details:', error)
    if (error instanceof Error) {
      console.error('🔴 [PAYMENT REQUEST] Error message:', error.message)
      console.error('🔴 [PAYMENT REQUEST] Error stack:', error.stack)
    }
    console.log('🔴 [PAYMENT REQUEST] ========== END (ERROR) ==========')
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
