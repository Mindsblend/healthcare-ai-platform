import { NextRequest, NextResponse } from 'next/server'
import { CartService } from '@/features/shop/services/CartService'

export async function POST(req: NextRequest) {
  try {
    const { cartId, productId, quantity } = await req.json()
    const updatedCartItem = await CartService.addItem(cartId, productId, quantity)
    return NextResponse.json(updatedCartItem)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to add item' }, { status: 500 })
  }
}