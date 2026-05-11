import { ProductService } from '@/features/shop/services/ProductService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST(req: Request) {
  await requireAuthority('ADMIN')
  try {
    const data = await req.json()
    const product = await ProductService.deleteProduct(data)
    return new Response(JSON.stringify(product), { status: 201 })
  } catch (error: any) {
    console.error('[deleteProduct API] error:', error)
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { status: 500 },
    )
  }
}
