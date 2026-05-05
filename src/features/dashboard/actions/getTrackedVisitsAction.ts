export async function getTrackedVisitsAction() {
  const res = await fetch('/api/analytics/track-visit')
  if (!res.ok) throw new Error('Failed to get visits')
  return res.json()
}