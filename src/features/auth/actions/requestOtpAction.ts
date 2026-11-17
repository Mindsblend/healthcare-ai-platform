import { RequestOtpInput, RequestOtpResponse } from '../auth.types'

export async function requestOtp(
  input: RequestOtpInput,
): Promise<RequestOtpResponse> {
  const res = await fetch('/api/auth/otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}
