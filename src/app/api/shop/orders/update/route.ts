import { requireAuthority } from '@/features/auth/services/sessionService'
import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/features/dashboard/services/OrderService'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  await requireAuthority('ADMIN')
  try {
    const body = await req.json()

    // Only allow certain updates based on order status
    const allowedUpdates: any = {}

    // Always allowed updates
    if (body.status) allowedUpdates.status = body.status
    if (body.shippingNotes) allowedUpdates.shippingNotes = body.shippingNotes

    // NEVER allow these to be updated after order creation
    // - customer name (shippingFirstName, shippingLastName)
    // - products, quantities, prices
    // - order total
    // - address

    const updatedOrder = await OrderService.updateOrder(
      params.id,
      allowedUpdates,
    )
    return NextResponse.json(updatedOrder)
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 },
    )
  }
}
