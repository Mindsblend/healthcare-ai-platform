export interface SubmitHealthAssessmentInput {
  answers: Record<number, string>
}

export interface SubmitHealthAssessmentResponse {
  success: boolean

  assessment: {
    id: string
    overallScore: number

    domainScores: {
      sleep: number
      nutrition: number
      activity: number
      stress: number
      beauty: number
      medical: number
    }
  }

  analysis: {
    summary: string
    diagnosis: string
    goals: string[]
    healthArchetype: string
    readinessStage: string
  }

  recommendations: {
    productId: string
    reason: string
    domain: string
    priority: number
  }[]
}

export async function submitHealthAssessment(
  input: SubmitHealthAssessmentInput,
): Promise<SubmitHealthAssessmentResponse> {
  const res = await fetch('/api/shop/health/assess', {
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify(input),
  })

  if (!res.ok) {
    let errorMessage = 'Failed to submit health assessment'

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
