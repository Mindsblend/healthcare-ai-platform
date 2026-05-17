import { UserService } from '@/features/shop/services/UserService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST(req: Request) {
  const session = await requireAuthority({ requiredRole: 'USER' })
  try {
    const data = await req.json()
    const address = await UserService.createAddress(session.id, data)
    return new Response(JSON.stringify(address), { status: 201 })
  } catch (error: any) {
    console.error('[createAddress API] error:', error)
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { status: 500 },
    )
  }
}
