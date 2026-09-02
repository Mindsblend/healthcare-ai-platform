import { LogOutResponse } from '../auth.types'

export async function logOut(): Promise<LogOutResponse> {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[logOut] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}