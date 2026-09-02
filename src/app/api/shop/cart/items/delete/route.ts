import { NextRequest, NextResponse } from 'next/server'
import { CartService } from '@/features/shop/services/CartService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST(req: NextRequest) {
  await requireAuthority({ requiredRole: 'USER' })
  try {
    const { cartItemId } = await req.json()
    const deletedItem = await CartService.removeItem({ cartItemId })
    return NextResponse.json(deletedItem)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 },
    )
  }
}
