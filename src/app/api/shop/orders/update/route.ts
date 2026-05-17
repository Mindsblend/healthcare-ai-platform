// app/api/shop/orders/update/route.ts
import { requireAuthority } from '@/features/auth/services/sessionService'
import { NextRequest, NextResponse } from 'next/server'
import { OrderService } from '@/features/shop/services/OrderService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Get orderId from body instead of params
    const { orderId, status, shippingNotes } = body

    if (!orderId) {
      return NextResponse.json(
        { error: 'orderId is required' },
        { status: 400 },
      )
    }

    // Check authorization
    await requireAuthority({ requiredRole: 'ADMIN' })

    // Only allow certain updates
    const allowedUpdates: any = {}
    if (status) allowedUpdates.status = status
    if (shippingNotes) allowedUpdates.shippingNotes = shippingNotes

    // Check if there's anything to update
    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 },
      )
    }

    const updatedOrder = await OrderService.updateOrder({
      orderId: orderId,
      ...allowedUpdates,
    })

    return NextResponse.json(updatedOrder)
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Failed to update order'
    const statusCode = errorMessage.includes('not found')
      ? 404
      : errorMessage.includes('Cannot update')
        ? 400
        : 500

    return NextResponse.json({ error: errorMessage }, { status: statusCode })
  }
}
