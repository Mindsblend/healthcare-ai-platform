
import { UserService } from '@/features/shop/services/UserService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  let userId: string

  // مرحله اول: بررسی احراز هویت
  try {
    const session = await requireAuthority({
      requiredRole: 'USER',
    })

    userId = session.id
  } catch (error) {
    console.error('[Savings API] Authentication error:', error)

    return Response.json(
      { error: 'Authentication failed' },
      { status: 401 },
    )
  }

  // مرحله دوم: محاسبه سود خرید
  try {
    const savingsAmount =
      await UserService.fetchUserTotalSavings(userId)

    return Response.json({ savingsAmount }, { status: 200 })
  } catch (error) {
    console.error('[Savings API] Savings calculation error:', error)

    return Response.json(
      { error: 'Savings calculation failed' },
      { status: 500 },
    )
  }
}
