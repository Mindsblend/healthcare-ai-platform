import { OrderService } from '@/features/dashboard/services/OrderService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST(req: Request) {
  try {
    const session = await requireAuthority('USER')
    
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
