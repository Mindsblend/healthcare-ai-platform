import { ProductService } from '@/features/shop/services/ProductService'

export async function GET() {
  try {
    const products = await ProductService.fetchProductsPreview()
    return new Response(JSON.stringify(products), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
      status: 500,
    })
  }
}
