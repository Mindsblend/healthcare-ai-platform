import { OrderService } from '@/features/shop/services/OrderService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  await requireAuthority({ requiredRole: 'ADMIN' })
  try {
    const orders = await OrderService.fetchOrdersPreview()
    return new Response(JSON.stringify(orders), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
    })
  }
}
