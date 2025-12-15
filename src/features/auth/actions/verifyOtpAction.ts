export async function verifyOtp(identifier: string, code: string) {
  const res = await fetch('/api/auth/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, code }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error || 'OTP verification failed')
  }

  window.location.href = data.redirect || '/'

  return data
}
