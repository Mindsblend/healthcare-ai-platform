import { fetchAllOrders } from '@/features/dashboard/services/fetchOrdersService'

export async function GET() {
  try {
    const orders = await fetchAllOrders()
    return new Response(JSON.stringify(orders), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch orders' }), {
      status: 500,
    })
  }
}
