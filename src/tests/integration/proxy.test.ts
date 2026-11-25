import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { NextRequest } from 'next/server'

const { getSessionFromRequestMock } = vi.hoisted(() => ({
  getSessionFromRequestMock: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  getSessionFromRequest: getSessionFromRequestMock,
}))

vi.mock('@/lib/paths', () => ({
  getRouteType: vi.fn((pathname: string) => {
    if (pathname.startsWith('/order') || pathname === '/profile') {
      return 'user'
    }
    if (pathname.startsWith('/dashboard')) {
      return 'admin'
    }
    // External-looking paths are treated as public (no redirect)
    return 'public'
  }),
}))

import { proxy } from '@/proxy'

function createRequest(pathname: string, cookie?: string) {
  return new NextRequest(`http://localhost${pathname}`, {
    headers: cookie ? { cookie } : {},
  }) as NextRequest
}

describe('proxy middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('allows public routes without session', async () => {
    getSessionFromRequestMock.mockReturnValue(null)

    const response = await proxy(createRequest('/cart'))
    expect(response.status).toBe(200)
  })

  it('allows public routes with session', async () => {
    getSessionFromRequestMock.mockReturnValue({
      id: 'user-1',
      role: 'USER',
    })

    const response = await proxy(createRequest('/cart'))
    expect(response.status).toBe(200)
  })

  it('redirects unauthenticated user from protected route to /auth', async () => {
    getSessionFromRequestMock.mockReturnValue(null)

    const response = await proxy(createRequest('/order'))
    expect(response.status).toBe(307)
    const location = response.headers.get('location')
    expect(location).toContain('/auth')
    expect(location).toContain('callbackUrl=%2Forder')
  })

  it('allows authenticated user on protected route', async () => {
    getSessionFromRequestMock.mockReturnValue({
      id: 'user-1',
      role: 'USER',
    })

    const response = await proxy(createRequest('/order'))
    expect(response.status).toBe(200)
  })

  it('redirects non-admin user from admin route', async () => {
    getSessionFromRequestMock.mockReturnValue({
      id: 'user-1',
      role: 'USER',
    })

    const response = await proxy(createRequest('/dashboard'))
    expect(response.status).toBe(307)
    const location = response.headers.get('location')
    expect(location).toBe('http://localhost/')
  })

  it('allows admin user on admin route', async () => {
    getSessionFromRequestMock.mockReturnValue({
      id: 'admin-1',
      role: 'ADMIN',
    })

    const response = await proxy(createRequest('/dashboard'))
    expect(response.status).toBe(200)
  })

  it('redirects unauthenticated user from /order with callbackUrl', async () => {
    getSessionFromRequestMock.mockReturnValue(null)

    const response = await proxy(createRequest('/order'))
    const location = response.headers.get('location')
    expect(location).toContain('/auth?callbackUrl=%2Forder')
  })

  it('allows external-looking paths as public (no redirect)', async () => {
    getSessionFromRequestMock.mockReturnValue(null)

    const response = await proxy(createRequest('//evil.com'))
    // External paths are treated as public, so no redirect
    expect(response.status).toBe(200)
  })
})