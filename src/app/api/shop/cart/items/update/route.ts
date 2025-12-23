import { NextRequest, NextResponse } from 'next/server'
import { CartService } from '@/features/shop/services/CartService'

export async function POST(req: NextRequest) {
  try {
    const { cartItemId, quantity } = await req.json()
    const updatedItem = await CartService.updateItemQuantity(cartItemId, quantity)
    return NextResponse.json(updatedItem)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}