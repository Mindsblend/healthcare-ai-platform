import { NextRequest, NextResponse } from 'next/server'
import { CartService } from '@/features/shop/services/CartService'

export async function POST(req: NextRequest) {
  try {
    const { cartItemId } = await req.json()
    const deletedItem = await CartService.removeItem(cartItemId)
    return NextResponse.json(deletedItem)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 })
  }
}