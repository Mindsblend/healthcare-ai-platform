import { CartService } from '@/features/shop/services/CartService'
import { getSession } from '@/features/auth/services/sessionService'

export async function POST() {
  const session = await getSession()
  if (!session) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      status: 401,
    })
  }

  try {
    const cart = await CartService.createCart(session.id)
    return new Response(JSON.stringify(cart), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create cart' }), {
      status: 500,
    })
  }
}
