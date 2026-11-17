import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { OrderService } from '@/features/shop/services/OrderService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await requireAuthority({ requiredRole: 'USER' })
    const { id: orderId } = await params

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 },
      )
    }

    const order = await OrderService.fetchOrderById({ id: orderId })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    if (session.role !== 'ADMIN' && order.userId !== session.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(order)
  } catch (error) {
    const message = error instanceof Error ? error.message : ''

    if (message === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.error('Failed to fetch order:', error)

    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 },
    )
  }
}
