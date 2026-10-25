import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthority, updateCollection } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  updateCollection: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/shop/services/CollectionService', () => ({
  CollectionService: {
    updateCollection,
  },
}))

import { PUT } from '@/app/api/shop/collections/update/route'

describe('PUT /api/shop/collections/update', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthority.mockResolvedValue(undefined)
  })

  it('updates a collection for an authorized admin', async () => {
    const body = {
      id: 7,
      name: 'Updated Collection',
      slug: 'updated-collection',
    }
    const collection = { ...body, isActive: true }
    updateCollection.mockResolvedValue(collection)

    const response = await PUT(
      new Request('http://localhost/api/shop/collections/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }) as never,
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(collection)
    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(updateCollection).toHaveBeenCalledWith(body)
  })

  it('does not update when authorization fails', async () => {
    requireAuthority.mockRejectedValue(new Error('Forbidden'))

    const response = await PUT(
      new Request('http://localhost/api/shop/collections/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 7, name: 'Restricted' }),
      }) as never,
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to update collection',
    })
    expect(updateCollection).not.toHaveBeenCalled()
  })

  it('returns 500 when updating the collection fails', async () => {
    updateCollection.mockRejectedValue(new Error('Update failed'))

    const response = await PUT(
      new Request('http://localhost/api/shop/collections/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 7, name: 'Updated Collection' }),
      }) as never,
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to update collection',
    })
  })

  it('returns 500 when the request body is malformed JSON', async () => {
    const response = await PUT(
      new Request('http://localhost/api/shop/collections/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json',
      }) as never,
    )

    expect(response.status).toBe(500)
    expect(updateCollection).not.toHaveBeenCalled()
  })
})
