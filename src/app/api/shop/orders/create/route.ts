import { OrderService } from '@/features/dashboard/services/OrderService'
import { getSession } from '@/features/auth/services/sessionService'

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
      })
    }

    const data = await req.json()
    console.log('[createOrder API] input data:', data)

    const order = await OrderService.createOrder({
      ...data,
      userId: session.id,
    })
    console.log('[createOrder API] created order:', order)

    return new Response(JSON.stringify(order), { status: 201 })
  } catch (error: any) {
    console.error('[createOrder API] error:', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'خطا در ثبت سفارش، لطفا دوباره تلاش کنید.',
      }),
      { status: 500 },
    )
  }
}
