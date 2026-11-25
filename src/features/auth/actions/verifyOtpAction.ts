import { VerifyOtpInput, VerifyOtpResponse } from '../auth.types'
import { isInternalUrl } from '@/lib/helpers'

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

  const redirect = data.redirect && isInternalUrl(data.redirect)
    ? data.redirect
    : '/'

  window.location.href = redirect

  return data
}
