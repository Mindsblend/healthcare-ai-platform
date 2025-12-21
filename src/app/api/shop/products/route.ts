import { fetchAllProducts } from '@/features/shop/services/fetchProductsService'

export async function GET() {
  try {
    const products = await fetchAllProducts()
    return new Response(JSON.stringify(products), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
    })
  }
}
