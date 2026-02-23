import { OrderService } from '@/features/dashboard/services/OrderService'

export async function GET() {
  try {
    const orders = await OrderService.fetchAllOrders()
    return new Response(JSON.stringify(orders), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
    })
  }
}
