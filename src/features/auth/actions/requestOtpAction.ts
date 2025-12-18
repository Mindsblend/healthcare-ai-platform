export async function requestOtp(identifier: string) {
  const res = await fetch('/api/auth/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier }),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[requestOtp] error object:', data?.error)

    // Throw a real JS Error with the service/domain error code
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}