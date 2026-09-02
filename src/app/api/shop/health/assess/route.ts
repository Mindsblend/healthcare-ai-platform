import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { AIHealthService } from '@/features/shop/services/AIService'
import { calculateScores, calculateOverallScore } from '@/lib/helpers'

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await requireAuthority({ requiredRole: 'USER' })

    // 2. Parse request body
    const body = await req.json()
    const { answers } = body

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request. Answers are required.' },
        { status: 400 },
      )
    }

    // 3. Calculate scores from answers
    const domainScores = calculateScores(answers)
    const overallScore = calculateOverallScore(domainScores)

    // 4. Generate AI analysis (calls GapGPT API with fallbacks)
    const analysis = await AIHealthService.generateAnalysis(
      answers,
      domainScores,
      overallScore,
    )

    // 5. Save assessment to database
    const assessment = await AIHealthService.saveAnalysis(
      session.id,
      answers,
      domainScores,
      overallScore,
      analysis,
    )

    // 6. Return complete response (no product recommendations)
    return NextResponse.json({
      success: true,
      assessment: {
        id: assessment.id,
        overallScore: assessment.overallScore,
        domainScores: {
          sleep: assessment.sleepScore,
          nutrition: assessment.nutritionScore,
          activity: assessment.activityScore,
          stress: assessment.stressScore,
          beauty: assessment.beautyScore,
          medical: assessment.medicalScore,
        },
      },
      analysis: {
        summary: analysis.summary,
        diagnosis: analysis.diagnosis,
        goals: analysis.goals,
        healthArchetype: analysis.healthArchetype,
        readinessStage: analysis.readinessStage,
        // Include new causal fields if they exist
        keyInsight: (analysis as any).keyInsight,
        causalChain: (analysis as any).causalChain,
      },
    })
  } catch (error) {
    console.error('Health assessment error:', error)

    return NextResponse.json(
      {
        error: 'Failed to process health assessment. Please try again.',
        details:
          process.env.NODE_ENV === 'development' ? String(error) : undefined,
      },
      { status: 500 },
    )
  }
}
