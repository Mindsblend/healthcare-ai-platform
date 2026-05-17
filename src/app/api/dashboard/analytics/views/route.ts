import { NextResponse } from 'next/server'
import { AnalyticsService } from '@/features/dashboard/services/AnalyticsService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  await requireAuthority({ requiredRole: 'ADMIN' })
  const visits = await AnalyticsService.fetchTrackedVisits()

  return NextResponse.json(visits)
}
