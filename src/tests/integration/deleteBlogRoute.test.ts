import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthority, deleteBlog } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  deleteBlog: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/shop/services/BlogService', () => ({
  BlogService: {
    deleteBlog,
  },
}))

import { POST } from '@/app/api/shop/blogs/delete/route'

describe('POST /api/shop/blogs/delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthority.mockResolvedValue(undefined)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('deletes a blog for an authorized admin', async () => {
    const body = { id: 7, slug: 'healthy-habits' }
    const result = { id: 7, deleted: true }
    deleteBlog.mockResolvedValue(result)

    const response = await POST(
      new Request('http://localhost/api/shop/blogs/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    )

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual(result)
    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(deleteBlog).toHaveBeenCalledWith(body)
  })

  it('propagates authorization failure without deleting a blog', async () => {
    requireAuthority.mockRejectedValue(new Error('Forbidden'))

    await expect(
      POST(
        new Request('http://localhost/api/shop/blogs/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: 7 }),
        }),
      ),
    ).rejects.toThrow('Forbidden')

    expect(deleteBlog).not.toHaveBeenCalled()
  })

  it('returns 500 when blog deletion fails', async () => {
    deleteBlog.mockRejectedValue(new Error('Deletion failed'))

    const response = await POST(
      new Request('http://localhost/api/shop/blogs/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 7 }),
      }),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Deletion failed' })
  })

  it('returns 500 when the request body is malformed JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/shop/blogs/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json',
      }),
    )

    expect(response.status).toBe(500)
    expect(deleteBlog).not.toHaveBeenCalled()
  })
})
