import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from './features/auth/services/sessionService'
import { getRouteType } from '@/lib/paths'

const AUTH_URL = '/auth'

function isInternalUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false
  if (!url.startsWith('/')) return false
  if (url.startsWith('//')) return false
  return true
}

function isPwaPublicPath(pathname: string): boolean {
  return (
    pathname === '/manifest.webmanifest' ||
    pathname.startsWith('/icons/') ||
    pathname === '/sw.js' ||
    pathname === '/offline' ||
    pathname.startsWith('/offline/')
  )
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // PWA public paths - never redirect to auth
  if (isPwaPublicPath(pathname)) {
    return NextResponse.next()
  }

  const routeType = getRouteType(pathname)

  // Public routes - no check
  if (routeType === 'public') {
    return NextResponse.next()
  }

  const session = getSessionFromRequest(req)

  // No session - redirect to auth with callbackUrl
  if (!session) {
    const callbackUrl = isInternalUrl(pathname) ? pathname : '/'
    const authUrl = new URL(AUTH_URL, req.url)
    authUrl.searchParams.set('callbackUrl', callbackUrl)
    return NextResponse.redirect(authUrl)
  }

  // Admin route check
  if (routeType === 'admin' && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)',
  ],
}