import { UserService } from '@/features/shop/services/UserService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  const session = await requireAuthority({ requiredRole: 'USER' })
  try {
    const userInfo = await UserService.fetchCurrentUser(session.id)
    return new Response(JSON.stringify(userInfo), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch user info' }),
      {
        status: 500,
      },
    )
  }
}
