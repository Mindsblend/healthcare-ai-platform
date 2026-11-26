/**
 * اعتبارسنجی اشتراک‌های Web Push.
 *
 * endpoint باید HTTPS باشد و میزبان آن یکی از سرویس‌های شناخته‌شده Push باشد.
 * این کار از SSRF و ارسال درخواست به میزبان‌های دلخواه جلوگیری می‌کند.
 */

const ALLOWED_PUSH_HOSTS = [
  'fcm.googleapis.com',
  'android.googleapis.com',
  'updates.push.services.mozilla.com',
  'push.services.mozilla.com',
] as const

const ALLOWED_PUSH_HOST_SUFFIXES = [
  '.notify.windows.com',
  '.push.apple.com',
  '.push.services.mozilla.com',
] as const

const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/

export type PushSubscriptionKeys = {
  p256dh: string
  auth: string
}

export type ValidatedPushSubscription = {
  endpoint: string
  keys: PushSubscriptionKeys
}

function isAllowedHost(hostname: string): boolean {
  const host = hostname.toLowerCase()

  if ((ALLOWED_PUSH_HOSTS as readonly string[]).includes(host)) {
    return true
  }

  return ALLOWED_PUSH_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix))
}

export function normalizePushEndpoint(raw: unknown): string | null {
  if (typeof raw !== 'string') return null

  const value = raw.trim()
  if (!value || value.length > 2048) return null

  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }

  if (url.protocol !== 'https:') return null
  if (url.username || url.password) return null
  if (url.port && url.port !== '443') return null
  if (!isAllowedHost(url.hostname)) return null

  return url.toString()
}

function isValidKey(value: unknown, minLength: number, maxLength: number) {
  if (typeof value !== 'string') return false
  if (value.length < minLength || value.length > maxLength) return false
  return BASE64URL_PATTERN.test(value)
}

export function validatePushSubscriptionInput(
  input: unknown,
): ValidatedPushSubscription | null {
  if (!input || typeof input !== 'object') return null

  const candidate = input as {
    endpoint?: unknown
    keys?: { p256dh?: unknown; auth?: unknown }
  }

  const endpoint = normalizePushEndpoint(candidate.endpoint)
  if (!endpoint) return null

  const p256dh = candidate.keys?.p256dh
  const auth = candidate.keys?.auth

  if (!isValidKey(p256dh, 80, 120)) return null
  if (!isValidKey(auth, 16, 40)) return null

  return {
    endpoint,
    keys: {
      p256dh: p256dh as string,
      auth: auth as string,
    },
  }
}

export function validateUnsubscribeInput(
  input: unknown,
): { endpoint: string } | null {
  if (!input || typeof input !== 'object') return null

  const endpoint = normalizePushEndpoint(
    (input as { endpoint?: unknown }).endpoint,
  )
  if (!endpoint) return null

  return { endpoint }
}
