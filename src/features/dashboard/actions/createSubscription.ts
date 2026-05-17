// features/dashboard/actions/createSubscriptionAction.ts

import {
  CreateSubscriptionInput,
  SubscriptionPayload,
} from '../dashboard.types'

export async function createSubscriptionAction(
  input: CreateSubscriptionInput,
): Promise<SubscriptionPayload> {
  const res = await fetch('/api/dashboard/blogs/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.error || 'Failed to subscribe email')
  }

  return res.json()
}
