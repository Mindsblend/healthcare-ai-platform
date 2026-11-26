import { LogOutResponse } from '../auth.types'

export async function logOut(): Promise<LogOutResponse> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    const code = data?.error?.code || data?.message || 'UNKNOWN'
    console.error('[logOut] error object:', data?.error ?? data)
    throw new Error(code)
  }

  return data
}