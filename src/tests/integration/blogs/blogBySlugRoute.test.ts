import { beforeEach, describe, expect, it, vi } from 'vitest'

const { fetchBlogBySlug } = vi.hoisted(() => ({
  fetchBlogBySlug: vi.fn(),
}))

vi.mock('@/features/shop/services/BlogService', () => ({
  BlogService: {
    fetchBlogBySlug,
  },
}))

import { GET } from '@/app/api/shop/blogs/[slug]/route'

describe('GET /api/shop/blogs/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns a blog by its decoded slug', async () => {
    const blog = { id: 1, title: 'Test blog', slug: 'test-blog' }
    fetchBlogBySlug.mockResolvedValue(blog)

    const response = await GET(
      new Request('http://localhost/api/shop/blogs/test-blog') as never,
      { params: Promise.resolve({ slug: 'test-blog' }) },
    )

    expect(response.status).toBe(200)
    expect(await response.json()).toEqual(blog)
    expect(fetchBlogBySlug).toHaveBeenCalledWith({ slug: 'test-blog' })
  })

  it('decodes an encoded slug before fetching', async () => {
    fetchBlogBySlug.mockResolvedValue({ id: 2, slug: 'my blog' })

    const response = await GET(
      new Request('http://localhost/api/shop/blogs/my%20blog') as never,
      { params: Promise.resolve({ slug: 'my%20blog' }) },
    )

    expect(response.status).toBe(200)
    expect(fetchBlogBySlug).toHaveBeenCalledWith({ slug: 'my blog' })
  })

  it('returns 404 when the blog does not exist', async () => {
    fetchBlogBySlug.mockResolvedValue(null)

    const response = await GET(
      new Request('http://localhost/api/shop/blogs/missing') as never,
      { params: Promise.resolve({ slug: 'missing' }) },
    )

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({ error: 'Blog not found' })
  })

  it('returns 500 when fetching the blog fails', async () => {
    fetchBlogBySlug.mockRejectedValue(new Error('Database unavailable'))

    const response = await GET(
      new Request('http://localhost/api/shop/blogs/test-blog') as never,
      { params: Promise.resolve({ slug: 'test-blog' }) },
    )

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({ error: 'Failed to fetch blog' })
  })
})
