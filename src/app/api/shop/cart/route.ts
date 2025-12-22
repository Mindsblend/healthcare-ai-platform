import { CartService } from "@/features/shop/services/CartService"

export async function GET() {
  try {
    const cart = await CartService.fetchActiveCart()
    return new Response(JSON.stringify(cart), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch cart' }), {
      status: 500,
    })
  }
}
