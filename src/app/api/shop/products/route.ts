import { fetchProducts } from "@/features/shop/services/fetchProducts"

export async function GET() {
  try {
    const products = await fetchProducts()
    return new Response(JSON.stringify(products), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 })
  }
}