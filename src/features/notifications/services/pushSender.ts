import * as webpush from 'web-push'

export type PushPayload = {
  title: string
  body: string
  url?: string
  tag?: string
}

export type PushSendResult = {
  ok: boolean
  statusCode?: number
  error?: string
  /** اشتراک منقضی یا حذف شده است (404/410). */
  expired?: boolean
  /** خطای دائمی است و تلاش مجدد فایده ندارد. */
  permanent?: boolean
}

type PushSubscriptionRecord = {
  endpoint: string
  p256dh: string
  auth: string
}

let vapidConfigured: boolean | null = null

export function isPushConfigured(): boolean {
  if (vapidConfigured !== null) return vapidConfigured

  vapidConfigured = Boolean(
    process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY,
  )

  if (vapidConfigured) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:no-reply@digisalamat.ir',
      process.env.VAPID_PUBLIC_KEY as string,
      process.env.VAPID_PRIVATE_KEY as string,
    )
  }

  return vapidConfigured
}

/** برای تست‌ها امکان بازنشانی کش پیکربندی را فراهم می‌کند. */
export function resetPushConfigurationForTests(): void {
  vapidConfigured = null
}

/**
 * ارسال واقعی فقط در محیط production یا زمانی که صراحتاً فعال شده باشد.
 * این محافظ از ارسال اعلان واقعی در development و test جلوگیری می‌کند.
 */
export function isPushDeliveryEnabled(): boolean {
  const flag = process.env.PUSH_NOTIFICATIONS_ENABLED

  if (flag === 'false') return false
  if (flag === 'true') return true

  return process.env.NODE_ENV === 'production'
}

function getStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== 'object') return undefined

  const statusCode = (error as { statusCode?: unknown }).statusCode
  return typeof statusCode === 'number' ? statusCode : undefined
}

export async function sendPushNotification(
  subscription: PushSubscriptionRecord,
  payload: PushPayload,
): Promise<PushSendResult> {
  if (!isPushConfigured()) {
    return {
      ok: false,
      error: 'VAPID keys are not configured',
      permanent: true,
    }
  }

  try {
    const response = await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth,
        },
      },
      JSON.stringify(payload),
      {
        TTL: 60 * 60 * 24,
        urgency: 'normal',
      },
    )

    return { ok: true, statusCode: response.statusCode }
  } catch (error) {
    const statusCode = getStatusCode(error)
    const expired = statusCode === 404 || statusCode === 410

    const permanent =
      expired ||
      (statusCode !== undefined &&
        statusCode >= 400 &&
        statusCode < 500 &&
        statusCode !== 408 &&
        statusCode !== 429)

    return {
      ok: false,
      statusCode,
      expired,
      permanent,
      error: error instanceof Error ? error.message : 'Push delivery failed',
    }
  }
}
