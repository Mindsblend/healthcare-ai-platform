import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  const session = await requireAuthority({ requiredRole: 'USER' })

  try {
    const cart = await CartService.fetchActiveCart({
      userId: session.id,
    })

    return Response.json(cart, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch cart:', error)

    return Response.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}
