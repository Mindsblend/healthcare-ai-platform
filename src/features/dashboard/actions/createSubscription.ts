import { SubscriptionPayload } from '@/components/types/types'

export async function createSubscriptionAction(
  email: string,
): Promise<SubscriptionPayload> {
  const res = await fetch('/api/dashboard/blogs/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(email),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.error || 'Failed to subscribe email')
  }

  return res.json()
}
