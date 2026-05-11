import { UserService } from '@/features/shop/services/UserService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  await requireAuthority('ADMIN')
  try {
    const users = await UserService.fetchAllUsers()
    return new Response(JSON.stringify(users), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch users' }), {
      status: 500,
    })
  }
}
