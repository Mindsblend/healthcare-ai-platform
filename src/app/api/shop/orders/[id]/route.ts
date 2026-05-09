import { NextRequest } from 'next/server'
import { OrderService } from '@/features/shop/services/OrderService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log('=== API GET Order by ID ===')
  console.log('Request URL:', request.url)

  try {
    const resolvedParams = await params
    console.log('Resolved params:', resolvedParams)

    // The parameter name MUST match the folder name [id]
    const orderId = resolvedParams.id
    console.log('Order ID from params:', orderId)

    if (!orderId) {
      return new Response(JSON.stringify({ error: 'Order ID is required' }), {
        status: 400,
      })
    }

    const order = await OrderService.fetchOrderById(orderId)

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(order), { status: 200 })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch order' }), {
      status: 500,
    })
  }
}
