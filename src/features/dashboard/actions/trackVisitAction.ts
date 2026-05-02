import { VisitMonth } from '@/components/types/types'

export async function trackVisitAction(): Promise<VisitMonth> {
  const res = await fetch('/api/analytics/track-visit/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data?.error || 'Failed to track visit')
  }

  return res.json()
}
