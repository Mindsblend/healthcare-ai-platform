import { HealthAssessmentResult } from '@/components/types/types'

export async function getHealthAssessment(
  id: string,
): Promise<HealthAssessmentResult> {
  const res = await fetch(`/api/shop/health/assessment/${id}`, {
    method: 'GET',
  })

  if (!res.ok) {
    let errorMessage = 'Failed to fetch health assessment result'

    try {
      const errorData = await res.json()

      errorMessage = errorData.error || errorMessage
    } catch {
      // ignore json parse errors
    }

    throw new Error(errorMessage)
  }

  return res.json()
}
