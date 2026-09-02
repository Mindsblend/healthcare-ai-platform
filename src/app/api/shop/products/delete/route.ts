// app/api/shop/products/delete/route.ts

import { ProductService } from '@/features/shop/services/ProductService'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    await requireAuthority({ requiredRole: 'ADMIN' })

    const data = await req.json()
    console.log('[API DELETE] Raw request body:', data)
    console.log('[API DELETE] data.id:', data.id, 'type:', typeof data.id)
    console.log('[API DELETE] All keys:', Object.keys(data))

    // Make sure we have an id - check multiple possible names
    const productId = data.id

    if (!productId) {
      console.log('[API DELETE] No ID found in request!')
      return NextResponse.json(
        { error: 'Product ID is required. Received: ' + JSON.stringify(data) },
        { status: 400 },
      )
    }

    const product = await ProductService.deleteProduct({ id: productId })

    return NextResponse.json(
      { success: true, message: 'Product deleted successfully', product },
      { status: 200 },
    )
  } catch (error: any) {
    console.error('[deleteProduct API] error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 },
    )
  }
}
