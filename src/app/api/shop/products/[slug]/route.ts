import { NextRequest } from 'next/server'
import { ProductService } from '@/features/shop/services/ProductService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug: rawSlug } = await params
    const slug = decodeURIComponent(rawSlug)

    const product = await ProductService.fetchProductBySlug({ slug })

    if (!product) {
      return new Response(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(product), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch product' }), {
      status: 500,
    })
  }
}
