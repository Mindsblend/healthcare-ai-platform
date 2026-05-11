// app/api/shop/profile/update/route.ts
import { requireAuthority } from '@/features/auth/services/sessionService'
import { NextRequest, NextResponse } from 'next/server'
import { UserService } from '@/features/shop/services/UserService'

console.log('✅ PROFILE UPDATE API ROUTE FILE LOADED')

export async function POST(req: NextRequest) {
  console.log('🔵 POST request received at /api/shop/profile/update')

  try {
    console.log('Step 1: Parsing JSON...')
    const body = await req.json()
    console.log('Step 2: Body parsed:', body)

    const { userId, firstName, lastName, email, phone } = body
    console.log('Step 3: Extracted userId:', userId)

    if (!userId) {
      console.log('Step 4: No userId, returning 400')
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    console.log('Step 5: About to check authorization...')
    await requireAuthority('USER')
    console.log('Step 6: Authorization passed')

    // Create allowed updates object (only include fields that are provided)
    const allowedUpdates: any = {}
    if (firstName !== undefined) allowedUpdates.firstName = firstName
    if (lastName !== undefined) allowedUpdates.lastName = lastName
    if (email !== undefined) allowedUpdates.email = email
    if (phone !== undefined) allowedUpdates.phone = phone

    console.log('Step 6.5: Allowed updates:', allowedUpdates)

    if (Object.keys(allowedUpdates).length === 0) {
      console.log('Step 6.6: No updates provided')
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 },
      )
    }

    console.log('Step 7: About to update user profile...')
    const updatedUserProfile = await UserService.updateUserProfile(
      userId,
      allowedUpdates,
    )
    console.log('Step 8: Update completed, result:', updatedUserProfile)

    console.log('Step 9: Returning success response')
    return NextResponse.json(updatedUserProfile)
  } catch (error) {
    console.error('❌ CATCH BLOCK ERROR:', error)
    console.error(
      'Error stack:',
      error instanceof Error ? error.stack : 'No stack',
    )

    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 },
    )
  }
}
