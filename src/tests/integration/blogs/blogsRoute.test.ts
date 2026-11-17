import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchBlogsPreview } = vi.hoisted(() => ({
  fetchBlogsPreview: vi.fn(),
}))

vi.mock('@/features/shop/services/BlogService', () => ({
  BlogService: {
    fetchBlogsPreview,
  },
}))

import { GET } from '@/app/api/shop/blogs/route'

describe('GET /api/shop/blogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns blog previews with status 200', async () => {
    const blogs = [
      { id: 1, title: 'First blog', slug: 'first-blog' },
      { id: 2, title: 'Second blog', slug: 'second-blog' },
    ]
    fetchBlogsPreview.mockResolvedValue(blogs)

    const response = await GET()

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(blogs)
    expect(fetchBlogsPreview).toHaveBeenCalledOnce()
  })

  it('returns status 500 when fetching blogs fails', async () => {
    fetchBlogsPreview.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET()

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      error: 'Failed to fetch blogs',
    })
  })
})
