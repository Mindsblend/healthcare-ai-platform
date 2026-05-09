export async function getTrackedVisitsAction() {
  const res = await fetch('/api/dashboard/analytics/views')
  if (!res.ok) throw new Error('Failed to get visits')
  return res.json()
}
