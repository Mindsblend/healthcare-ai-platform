import { NextRequest, NextResponse } from 'next/server'
import { AIHealthService } from '@/features/shop/services/AIService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const session = await requireAuthority({ requiredRole: 'USER' })

    // Get user's latest assessment
    const assessment = await AIHealthService.getUserLatestAssessment(session.id)

    if (!assessment) {
      return NextResponse.json(
        {
          success: false,
          message:
            'No health assessment found. Please complete the assessment first.',
        },
        { status: 404 },
      )
    }

    // Return formatted response
    return NextResponse.json({
      success: true,
      assessment: {
        id: assessment.id,
        lastViewedAt: assessment.lastViewedAt,
        overallScore: assessment.overallScore,
        domainScores: {
          sleep: assessment.sleepScore,
          nutrition: assessment.nutritionScore,
          activity: assessment.activityScore,
          stress: assessment.stressScore,
          beauty: assessment.beautyScore,
          medical: assessment.medicalScore,
        },
        analysis: {
          summary: assessment.aiSummary,
          diagnosis: assessment.aiDiagnosis,
          goals: assessment.aiGoals,
          healthArchetype: assessment.healthArchetype,
          readinessStage: assessment.readinessStage,
        },
        recommendations: assessment.recommendations.map((rec) => ({
          productId: rec.productId,
          product: rec.product,
          reason: rec.reason,
          domain: rec.domain,
          priority: rec.priority,
        })),
      },
    })
  } catch (error) {
    console.error('Fetch assessment error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch health assessment. Please try again later.',
      },
      { status: 500 },
    )
  }
}
