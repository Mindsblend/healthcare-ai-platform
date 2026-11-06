import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthority, createCollection } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  createCollection: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/shop/services/CollectionService', () => ({
  CollectionService: {
    createCollection,
  },
}))

import { POST } from '@/app/api/shop/collections/create/route'

describe('POST /api/shop/collections/create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthority.mockResolvedValue(undefined)
  })

  it('creates a collection for an authorized admin', async () => {
    const body = { name: 'Daily Essentials', slug: 'daily-essentials' }
    const collection = { id: 1, ...body }
    createCollection.mockResolvedValue(collection)

    const response = await POST(
      new Request('http://localhost/api/shop/collections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(collection)
    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(createCollection).toHaveBeenCalledWith(body)
  })

  it('returns 500 and does not create a collection when authorization fails', async () => {
    requireAuthority.mockRejectedValue(new Error('Forbidden'))

    const response = await POST(
      new Request('http://localhost/api/shop/collections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Restricted' }),
      }),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Forbidden' })
    expect(createCollection).not.toHaveBeenCalled()
  })

  it('returns 500 when collection creation fails', async () => {
    createCollection.mockRejectedValue(new Error('Creation failed'))

    const response = await POST(
      new Request('http://localhost/api/shop/collections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Daily Essentials' }),
      }),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Creation failed' })
  })

  it('returns 500 when the request body is malformed JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/shop/collections/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json',
      }),
    )

    expect(response.status).toBe(500)
    expect(createCollection).not.toHaveBeenCalled()
  })
})
