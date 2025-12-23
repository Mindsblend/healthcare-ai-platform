export async function verifyOtp(identifier: string, code: string) {
  const res = await fetch('/api/auth/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, code }),
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[verifyOtp] error object:', data?.error)
    // throw Error using the code from API
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  if (data.redirect) {
    window.location.href = data.redirect
  } else {
    window.location.href = '/'
  }

  return data
}
