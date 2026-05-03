import { ProductService } from "@/features/shop/services/ProductService"

export async function POST(req: Request) {
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
