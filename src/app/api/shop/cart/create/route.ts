import { CartService } from "@/features/shop/services/CartService"

export async function POST() {
  try {
    const cart = await CartService.createCart()
    return new Response(JSON.stringify(cart), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create cart' }), {
      status: 500,
    })
  }
}
