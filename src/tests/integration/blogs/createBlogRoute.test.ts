import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAuthority, createBlog } = vi.hoisted(() => ({
  requireAuthority: vi.fn(),
  createBlog: vi.fn(),
}))

vi.mock('@/features/auth/services/sessionService', () => ({
  requireAuthority,
}))

vi.mock('@/features/shop/services/BlogService', () => ({
  BlogService: {
    createBlog,
  },
}))

import { POST } from '@/app/api/shop/blogs/create/route'

describe('POST /api/shop/blogs/create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requireAuthority.mockResolvedValue(undefined)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('creates a blog for an authorized admin', async () => {
    const body = {
      title: 'Healthy Habits',
      slug: 'healthy-habits',
      content: 'Example content',
    }
    const blog = { id: 1, ...body }
    createBlog.mockResolvedValue(blog)

    const response = await POST(
      new Request('http://localhost/api/shop/blogs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    )

    expect(response.status).toBe(201)
    expect(await response.json()).toEqual(blog)
    expect(requireAuthority).toHaveBeenCalledWith({
      requiredRole: 'ADMIN',
    })
    expect(createBlog).toHaveBeenCalledWith(body)
  })

  it('propagates authorization failure without creating a blog', async () => {
    requireAuthority.mockRejectedValue(new Error('Forbidden'))

    await expect(
      POST(
        new Request('http://localhost/api/shop/blogs/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Restricted' }),
        }),
      ),
    ).rejects.toThrow('Forbidden')

    expect(createBlog).not.toHaveBeenCalled()
  })

  it('returns 500 when blog creation fails', async () => {
    createBlog.mockRejectedValue(new Error('Creation failed'))

    const response = await POST(
      new Request('http://localhost/api/shop/blogs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Healthy Habits' }),
      }),
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Creation failed' })
  })

  it('returns 500 when the request body is malformed JSON', async () => {
    const response = await POST(
      new Request('http://localhost/api/shop/blogs/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{invalid json',
      }),
    )

    expect(response.status).toBe(500)
    expect(createBlog).not.toHaveBeenCalled()
  })
})
