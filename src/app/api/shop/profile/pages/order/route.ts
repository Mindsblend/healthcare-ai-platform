import { UserService } from '@/features/shop/services/UserService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  const session = await requireAuthority('USER')
  try {
    const userOrder = await UserService.fetchUserWithOrders(session.id)
    return new Response(JSON.stringify(userOrder), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user orders' }),
      {
        status: 500,
      },
    )
  }
}
