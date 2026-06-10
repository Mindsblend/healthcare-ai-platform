import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { requireAuthority } from '@/features/auth/services/sessionService'

type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: NextRequest, { params }: Props) {
  try {
    const session = await requireAuthority({
      requiredRole: 'USER',
    })

    const { id } = await params

    const assessment = await prisma.healthAssessment.findFirst({
      where: {
        id,
        userId: session.id,
      },

      include: {
        recommendations: true,
      },
    })

    if (!assessment) {
      return NextResponse.json(
        {
          error: 'Assessment not found',
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      {
        status: 500,
      },
    )
  }
}
