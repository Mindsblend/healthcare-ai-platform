// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/features/auth/services/verifyToken'
import { getRouteType } from '@/lib/paths'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const routeType = getRouteType(pathname)

  // Public routes - no check
  if (routeType === 'public') {
    return NextResponse.next()
  }

  const token = req.cookies.get('session')?.value

  // No token - redirect to login
  if (!token) {
    const authUrl = new URL('/auth', req.url)
    authUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(authUrl)
  }

  const session = verifyToken(token)

  // Invalid token - redirect to login
  if (!session) {
    const authUrl = new URL('/auth', req.url)
    authUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(authUrl)
  }

  // Admin route check
  if (routeType === 'admin' && session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  // User route check (any logged-in user is fine)
  // ADMIN can also access user routes

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
