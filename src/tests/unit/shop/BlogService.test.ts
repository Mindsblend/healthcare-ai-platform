import { beforeEach, describe, expect, it, vi } from 'vitest'
import { BlogService } from '@/features/shop/services/BlogService'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    blog: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}))

describe('BlogService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchBlogsPreview', () => {
    it('returns the blogs returned by Prisma', async () => {
      const blogs = [
        { id: 1, title: 'First Blog', slug: 'first-blog' },
        { id: 2, title: 'Second Blog', slug: 'second-blog' },
      ]

      vi.mocked(prisma.blog.findMany).mockResolvedValue(blogs as any)

      const result = await BlogService.fetchBlogsPreview()

      expect(result).toEqual(blogs)
      expect(prisma.blog.findMany).toHaveBeenCalledOnce()
      expect(prisma.blog.findMany).toHaveBeenCalledWith()
    })

    it('returns an empty array when no blogs exist', async () => {
      vi.mocked(prisma.blog.findMany).mockResolvedValue([])

      const result = await BlogService.fetchBlogsPreview()

      expect(result).toEqual([])
    })

    it('propagates Prisma errors', async () => {
      vi.mocked(prisma.blog.findMany).mockRejectedValue(
        new Error('Database unavailable'),
      )

      await expect(BlogService.fetchBlogsPreview()).rejects.toThrow(
        'Database unavailable',
      )
    })
  })

  describe('fetchBlogBySlug', () => {
    it('fetches a blog using the supplied slug', async () => {
      const blog = {
        id: 1,
        title: 'First Blog',
        slug: 'first-blog',
      }

      vi.mocked(prisma.blog.findUnique).mockResolvedValue(blog as any)

      const result = await BlogService.fetchBlogBySlug({
        slug: 'first-blog',
      })

      expect(result).toEqual(blog)
      expect(prisma.blog.findUnique).toHaveBeenCalledWith({
        where: { slug: 'first-blog' },
      })
    })

    it('returns null when the slug does not exist', async () => {
      vi.mocked(prisma.blog.findUnique).mockResolvedValue(null)

      const result = await BlogService.fetchBlogBySlug({
        slug: 'missing-blog',
      })

      expect(result).toBeNull()
    })

    it('propagates Prisma errors', async () => {
      vi.mocked(prisma.blog.findUnique).mockRejectedValue(
        new Error('Database unavailable'),
      )

      await expect(
        BlogService.fetchBlogBySlug({ slug: 'first-blog' }),
      ).rejects.toThrow('Database unavailable')
    })
  })

  describe('createBlog', () => {
    it('creates a blog with the supplied fields', async () => {
      const input = {
        title: 'Testing with Vitest',
        slug: 'testing-with-vitest',
        description: 'A testing guide',
        image: '/images/testing.png',
        author: 'Ashkan',
        authorImage: '/images/author.png',
        content: 'Blog content',
        authorTitle: 'Software Engineer',
      }

      const createdBlog = { id: 1, ...input }

      vi.mocked(prisma.blog.create).mockResolvedValue(createdBlog as any)

      const result = await BlogService.createBlog(input)

      expect(result).toEqual(createdBlog)
      expect(prisma.blog.create).toHaveBeenCalledWith({
        data: input,
      })
    })

    it('propagates Prisma errors', async () => {
      vi.mocked(prisma.blog.create).mockRejectedValue(
        new Error('Create failed'),
      )

      await expect(
        BlogService.createBlog({
          title: 'Testing with Vitest',
          slug: 'testing-with-vitest',
          description: 'A testing guide',
          image: '/images/testing.png',
          author: 'Ashkan',
          authorImage: '/images/author.png',
          content: 'Blog content',
          authorTitle: 'Software Engineer',
        }),
      ).rejects.toThrow('Create failed')
    })
  })

  describe('deleteBlog', () => {
    it('deletes a blog by its ID', async () => {
      const deletedBlog = {
        id: 42,
        title: 'Old Blog',
        slug: 'old-blog',
      }

      vi.mocked(prisma.blog.delete).mockResolvedValue(deletedBlog as any)

      const result = await BlogService.deleteBlog({ id: 42 })

      expect(result).toEqual(deletedBlog)
      expect(prisma.blog.delete).toHaveBeenCalledWith({
        where: { id: 42 },
      })
    })

    it('propagates Prisma errors', async () => {
      vi.mocked(prisma.blog.delete).mockRejectedValue(
        new Error('Record not found'),
      )

      await expect(BlogService.deleteBlog({ id: 999 })).rejects.toThrow(
        'Record not found',
      )
    })
  })
})
