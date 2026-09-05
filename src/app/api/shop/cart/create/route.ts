import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST() {
  try {
    const session = await requireAuthority({
      requiredRole: 'USER',
    })

    const cart = await CartService.createCart({
      userId: session.id,
    })

    return new Response(JSON.stringify(cart), {
      status: 200,
    })
  } catch (error) {
    console.error('[POST /api/cart/create]', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to create cart',
      }),
      {
        status: 500,
      },
    )
  }
}
