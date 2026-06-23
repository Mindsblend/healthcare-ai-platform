import { NextRequest, NextResponse } from 'next/server'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { AIHealthService } from '@/features/shop/services/AIService'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAuthority({
      requiredRole: 'USER',
    })

    const { id } = params

    const assessment = await AIHealthService.getAssessmentById(
      id,
      session.id,
    )

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}