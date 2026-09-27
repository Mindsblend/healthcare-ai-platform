// src/app/robots.ts

import type { MetadataRoute } from 'next'

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com'
).replace(/\/$/, '')

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', 'feed'],
      disallow: [
        '/api/',
        '/dashboard/',
        '/profile/',
        '/cart/',
        '/order/',
        '/payment/',
        '/auth/',
      ],
    },

    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
