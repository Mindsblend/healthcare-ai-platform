export async function refreshTokenSession() {
  const res = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[refreshSession] error object:', data?.error)
    throw new Error(data?.error?.code || 'SESSION_REFRESH_FAILED')
  }

  return data
}
