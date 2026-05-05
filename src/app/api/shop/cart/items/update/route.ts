import { NextRequest, NextResponse } from 'next/server'
import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST(req: NextRequest) {
  await requireAuthority('USER')
  try {
    const { cartItemId, quantity } = await req.json()
    const updatedItem = await CartService.updateItemQuantity(cartItemId, quantity)
    return NextResponse.json(updatedItem)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}