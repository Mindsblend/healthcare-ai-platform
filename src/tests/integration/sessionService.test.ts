import { beforeEach, describe, expect, it, vi } from 'vitest'

const { cookiesMock } = vi.hoisted(() => ({
  cookiesMock: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: cookiesMock,
}))

import { requireAuthority } from '@/features/auth/services/sessionService'
import { sign } from 'jsonwebtoken'

describe('requireAuthority', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.JWT_SECRET = 'test-secret-for-session-tests'
  })

  it('rejects when there is no session', async () => {
    cookiesMock.mockResolvedValue({
      get: () => undefined,
      delete: vi.fn(),
    })

    await expect(
      requireAuthority({ requiredRole: 'ADMIN' }),
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
  })

  it('rejects a USER requesting ADMIN authority', async () => {
    const token = sign(
      {
        id: 'user-1',
        email: 'user@example.com',
        phone: null,
        role: 'USER',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    )

    cookiesMock.mockResolvedValue({
      get: () => ({ value: token }),
      delete: vi.fn(),
    })

    await expect(
      requireAuthority({ requiredRole: 'ADMIN' }),
    ).rejects.toMatchObject({
      code: 'UNAUTHORIZED',
    })
  })

  it('allows an ADMIN requesting ADMIN authority', async () => {
    const token = sign(
      {
        id: 'admin-1',
        email: 'admin@example.com',
        phone: null,
        role: 'ADMIN',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    )

    cookiesMock.mockResolvedValue({
      get: () => ({ value: token }),
      delete: vi.fn(),
    })

    await expect(
      requireAuthority({ requiredRole: 'ADMIN' }),
    ).resolves.toMatchObject({
      id: 'admin-1',
      role: 'ADMIN',
    })
  })

  it('allows an ADMIN requesting USER authority', async () => {
    const token = sign(
      {
        id: 'admin-1',
        email: 'admin@example.com',
        phone: null,
        role: 'ADMIN',
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    )

    cookiesMock.mockResolvedValue({
      get: () => ({ value: token }),
      delete: vi.fn(),
    })

    await expect(
      requireAuthority({ requiredRole: 'USER' }),
    ).resolves.toMatchObject({
      id: 'admin-1',
      role: 'ADMIN',
    })
  })
})
