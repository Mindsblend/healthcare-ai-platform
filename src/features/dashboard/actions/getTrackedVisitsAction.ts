import { GetTrackedVisitsResponse } from '../dashboard.types'

export async function getTrackedVisitsAction(): Promise<GetTrackedVisitsResponse> {
  const res = await fetch('/api/dashboard/analytics/views')
  if (!res.ok) throw new Error('Failed to get visits')
  return res.json()
}
