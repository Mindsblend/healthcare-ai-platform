export async function requestOtp(identifier: string) {
  const res = await fetch('/api/auth/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  })

  if (!res.ok) {
    throw new Error('OTP request failed')
  }

  return res.json()
}
