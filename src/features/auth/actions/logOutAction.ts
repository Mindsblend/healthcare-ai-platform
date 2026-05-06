export async function logOut(userId: any) {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[logOut] error object:', data?.error)

    // Throw a real JS Error with the service/domain error code
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}