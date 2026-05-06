import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AnalyticsService } from '@/features/dashboard/services/AnalyticsService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function GET() {
  await requireAuthority('ADMIN')
  const visits = await AnalyticsService.fetchTrackedVisits()

  return NextResponse.json(visits)
}
