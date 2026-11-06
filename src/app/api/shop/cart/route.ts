import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  try {
    const session = await requireAuthority({ requiredRole: 'USER' })

    const cart = await CartService.createCart({
      userId: session.id,
    })

    return Response.json(cart, { status: 200 })
  } catch (error) {
    console.error('Failed to fetch cart:', error)

    return Response.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}
