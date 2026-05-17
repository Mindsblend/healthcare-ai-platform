import { NextRequest, NextResponse } from 'next/server'
import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST(req: NextRequest) {
  await requireAuthority({ requiredRole: 'USER' })
  try {
    const { cartId, productId, quantity } = await req.json()
    const updatedCartItem = await CartService.addItem({
      cartId,
      productId,
      quantity,
    })
    return NextResponse.json(updatedCartItem)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}
