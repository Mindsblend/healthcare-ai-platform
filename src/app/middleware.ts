import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/features/auth/services/verifyToken'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('session')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const session = verifyToken(token)

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
