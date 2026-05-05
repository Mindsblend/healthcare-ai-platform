import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST() {
  const session = await requireAuthority('USER')
  try {
    const cart = await CartService.createCart(session.id)
    return new Response(JSON.stringify(cart), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create cart' }), {
      status: 500,
    })
  }
}
