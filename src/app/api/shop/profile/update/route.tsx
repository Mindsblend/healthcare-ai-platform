import { requireAuthority } from '@/features/auth/services/sessionService'
import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/features/shop/services/UserService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    let { firstName, lastName, email, phone } = body

    const user = await requireAuthority({ requiredRole: 'USER' })
    const userId = user.id

    // Create allowed updates object (only include fields that are provided)
    const allowedUpdates: any = {}
    if (firstName !== undefined) allowedUpdates.firstName = firstName
    if (lastName !== undefined) allowedUpdates.lastName = lastName
    if (email !== undefined) allowedUpdates.email = email
    if (phone !== undefined) allowedUpdates.phone = phone

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 },
      )
    }
    const updatedUserProfile = await UserService.updateUserProfile(
      userId,
      allowedUpdates,
    )
    return NextResponse.json(updatedUserProfile)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 },
    )
  }
}
