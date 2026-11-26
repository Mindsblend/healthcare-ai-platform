import { createSerwistRoute } from '@serwist/turbopack'
import type { NextRequest, NextResponse } from 'next/server'

const serwistRoute = createSerwistRoute({
  swSrc: 'src/app/sw.ts',
  globDirectory: '.next/server/app',
  globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2,webp,webmanifest}'],
  globIgnores: [
    '**/manifest.webmanifest',
    '**/icons/*',
    '**/offline/**',
    '**/sw.js',
    '**/workbox-*.js',
  ],
  additionalPrecacheEntries: [
    { url: '/offline', revision: '1' },
  ],
})

export const { generateStaticParams, dynamic, dynamicParams, revalidate } = serwistRoute

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{}> }
): Promise<NextResponse> {
  return serwistRoute.GET(_request, { params: Promise.resolve({ path: '' }) })
}