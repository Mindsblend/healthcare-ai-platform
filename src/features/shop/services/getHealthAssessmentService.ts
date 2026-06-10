import { HealthAssessmentResult } from '@/components/types/types'

export async function getHealthAssessmentService(
  id: string,
): Promise<HealthAssessmentResult> {
  const res = await fetch(`/api/shop/health/assessment/${id}`, {
    method: 'GET',
    cache: 'no-store',
  })

  const data: HealthAssessmentResult | null = await res.json().catch(() => null)

  if (!res.ok || !data) {
    throw new Error('Failed to fetch health assessment')
  }

  return data
}
