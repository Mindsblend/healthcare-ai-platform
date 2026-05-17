import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  const session = await requireAuthority({ requiredRole: 'USER' })
  try {
    const cart = await CartService.fetchActiveCart({ userId: session.id })
    return new Response(JSON.stringify(cart), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch cart' }), {
      status: 500,
    })
  }
}
