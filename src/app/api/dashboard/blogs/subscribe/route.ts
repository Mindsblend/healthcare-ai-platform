import { AnalyticsService } from '@/features/dashboard/services/AnalyticsService'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const subscription = await AnalyticsService.createSubscription(data)

    return new Response(JSON.stringify(subscription), { status: 201 })
  } catch (error: any) {
    console.error('[createSubscription API] error:', error)
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { status: 500 },
    )
  }
}
