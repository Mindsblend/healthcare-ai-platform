import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AnalyticsService } from '@/features/dashboard/services/AnalyticsService'

export async function GET() {
  const visits = await AnalyticsService.fetchTrackedVisits()

  return NextResponse.json(visits)
}
