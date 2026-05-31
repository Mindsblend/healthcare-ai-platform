import { getHealthAssessmentService } from '../../services/getHealthAssessmentService'

export async function getHealthAssessment(id: string) {
  try {
    return await getHealthAssessmentService(id)
  } catch (error) {
    console.error(error)

    throw new Error('Failed to fetch health assessment result')
  }
}
