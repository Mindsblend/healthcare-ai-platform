export async function updateUserProfileAction(data: {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}) {
  const res = await fetch('/api/shop/profile/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data }),
  })

  if (!res.ok) {
    const responseData = await res.json()
    throw new Error(responseData?.error || 'Failed to update profile')
  }

  return res.json()
}
