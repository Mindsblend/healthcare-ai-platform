/// <reference lib="webworker" />

import { Serwist } from 'serwist'
import type { PrecacheEntry } from 'serwist'

const swSelf = self as unknown as ServiceWorkerGlobalScope

const serwist = new Serwist({
  precacheEntries: (swSelf as unknown as { __SW_MANIFEST: (string | PrecacheEntry)[] }).__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
})

swSelf.addEventListener('push', ((event: PushEvent) => {
  if (!event.data) return

  let payload: {
    title: string
    body: string
    url?: string
    tag?: string
  }

  try {
    payload = JSON.parse(event.data.text())
  } catch {
    return
  }

  const options: NotificationOptions & { vibrate?: number[] } = {
    body: payload.body,
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    dir: 'rtl',
    lang: 'fa',
    tag: payload.tag || 'notification',
    data: {
      url: payload.url || '/profile/notifications',
    },
    requireInteraction: false,
    silent: false,
    vibrate: [100, 50, 100],
  }

  event.waitUntil(
    swSelf.registration.showNotification(payload.title, options)
  )
}) as EventListener)

swSelf.addEventListener('notificationclick', ((event: NotificationEvent) => {
  event.notification.close()

  const url = event.notification.data?.url || '/profile/notifications'

  if (!url.startsWith('/') && !url.startsWith(swSelf.location.origin)) {
    return
  }

  const absoluteUrl = url.startsWith('/')
    ? new URL(url, swSelf.location.origin).href
    : url

  event.waitUntil(
    swSelf.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === absoluteUrl && 'focus' in client) {
          return client.focus()
        }
      }
      return swSelf.clients.openWindow(absoluteUrl)
    })
  )
}) as EventListener)

swSelf.addEventListener('notificationclose', ((event: NotificationEvent) => {
  console.log('[SW] Notification closed:', event.notification.tag)
}) as EventListener)