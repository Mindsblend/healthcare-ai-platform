import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthority, findUnique, update } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  findUnique: vi.fn(),
  update: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    collection: {
      findUnique,
      update,
    },
  },
}))

import { DELETE } from '@/app/api/shop/collections/delete/[id]/route'

describe('DELETE /api/shop/collections/delete/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthority.mockResolvedValue(undefined)
  })

  it('soft-deletes a collection for an authorized admin', async () => {
    const existing = { id: 7, name: 'Collection', isActive: true }
    const updated = { ...existing, isActive: false }
    findUnique.mockResolvedValue(existing)
    update.mockResolvedValue(updated)

    const response = await DELETE(
      new Request('http://localhost/api/shop/collections/delete/7', {
        method: 'DELETE',
      }) as never,
      { params: Promise.resolve({ id: '7' }) },
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({
      success: true,
      collection: updated,
    })
    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 7 } })
    expect(update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { isActive: false },
    })
  })

  it('returns 400 for a non-numeric collection ID', async () => {
    const response = await DELETE(
      new Request('http://localhost/api/shop/collections/delete/abc', {
        method: 'DELETE',
      }) as never,
      { params: Promise.resolve({ id: 'abc' }) },
    )

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      error: 'Invalid collection ID',
    })
    expect(findUnique).not.toHaveBeenCalled()
    expect(update).not.toHaveBeenCalled()
  })

  it('returns 404 when the collection does not exist', async () => {
    findUnique.mockResolvedValue(null)

    const response = await DELETE(
      new Request('http://localhost/api/shop/collections/delete/99', {
        method: 'DELETE',
      }) as never,
      { params: Promise.resolve({ id: '99' }) },
    )

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      error: 'Collection not found',
    })
    expect(update).not.toHaveBeenCalled()
  })

  it('returns 500 and does not query collections when authorization fails', async () => {
    requireAuthority.mockRejectedValue(new Error('Forbidden'))

    const response = await DELETE(
      new Request('http://localhost/api/shop/collections/delete/7', {
        method: 'DELETE',
      }) as never,
      { params: Promise.resolve({ id: '7' }) },
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Forbidden' })
    expect(findUnique).not.toHaveBeenCalled()
    expect(update).not.toHaveBeenCalled()
  })

  it('returns 500 when the database update fails', async () => {
    findUnique.mockResolvedValue({ id: 7, isActive: true })
    update.mockRejectedValue(new Error('Database unavailable'))

    const response = await DELETE(
      new Request('http://localhost/api/shop/collections/delete/7', {
        method: 'DELETE',
      }) as never,
      { params: Promise.resolve({ id: '7' }) },
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Database unavailable',
    })
  })
})
