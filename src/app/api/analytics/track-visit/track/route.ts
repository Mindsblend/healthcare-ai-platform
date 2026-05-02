import { NextResponse } from 'next/server'
import { AnalyticsService } from '@/features/dashboard/services/AnalyticsService'

export async function POST() {
  try {
    const visits = await AnalyticsService.trackVisit()

    return NextResponse.json(visits, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to record visit' },
      { status: 500 },
    )
  }
}
