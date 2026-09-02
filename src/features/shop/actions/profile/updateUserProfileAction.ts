import { UpdateUserProfileInput, UpdateUserProfileResponse } from '../../shop.types'

export async function updateUserProfileAction(input: UpdateUserProfileInput): Promise<UpdateUserProfileResponse> {
  const res = await fetch('/api/shop/profile/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const responseData = await res.json()
    throw new Error(responseData?.error || 'Failed to update profile')
  }

  return res.json()
}