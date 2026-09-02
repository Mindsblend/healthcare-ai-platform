import { UserService } from '@/features/shop/services/UserService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  const session = await requireAuthority({ requiredRole: 'USER' })
  try {
    const userAddress = await UserService.fetchUserWithAddresses(session.id)
    return new Response(JSON.stringify(userAddress), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user addresses' }),
      {
        status: 500,
      },
    )
  }
}
