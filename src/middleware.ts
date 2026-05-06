import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './features/auth/services/sessionService'
import { getRouteType } from '@/lib/paths'

export async function middleware(req: NextRequest) { // Make it async
  const { pathname } = req.nextUrl
  const routeType = getRouteType(pathname)

  // Public routes - no check
  if (routeType === 'public') {
    return NextResponse.next()
  }

  // Use getSession which reads cookies properly
  const session = await getSession()

  // No session - redirect to auth
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