import { VerifyOtpInput, VerifyOtpResponse } from '../auth.types'

export async function verifyOtp(
  input: VerifyOtpInput,
): Promise<VerifyOtpResponse> {
  const res = await fetch('/api/auth/authorize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[verifyOtp] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  if (data.redirect) {
    window.location.href = data.redirect
  } else {
    window.location.href = '/'
  }

  return data
}
