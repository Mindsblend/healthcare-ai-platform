import { beforeEach, describe, expect, it, vi } from 'vitest'

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    feedCategory: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    product: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

import { prisma } from '@/lib/prisma'
import { FeedService } from '@/features/shop/services/FeedService'

describe('FeedService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const product = {
    id: 10,
    title: 'Hydrating Cream',
    price: 25,
    solution: 'Hydration',
    slug: 'hydrating-cream',
    image: '/cream.jpg',
    description: 'A hydrating cream',
    categoryId: 3,
    category: { name: 'Skincare', iconPath: '/skin.svg' },
  }

  const feedCategory = {
    id: 2,
    name: 'Popular',
    slug: 'popular',
    description: 'Popular products',
    order: 1,
    products: [product],
  }

  describe('fetchFeedCategories', () => {
    it('fetches categories with the requested limit and maps their products', async () => {
      vi.mocked(prisma.feedCategory.findMany).mockResolvedValue([
        feedCategory,
      ] as never)

      const result = await FeedService.fetchFeedCategories({ limit: 5 })

      expect(prisma.feedCategory.findMany).toHaveBeenCalledWith({
        take: 5,
        orderBy: { order: 'asc' },
        include: {
          products: {
            include: {
              category: {
                select: { name: true, iconPath: true },
              },
            },
          },
        },
      })

      expect(result).toEqual([
        {
          id: 2,
          name: 'Popular',
          slug: 'popular',
          description: 'Popular products',
          order: 1,
          products: [product],
        },
      ])
    })

    it('returns an empty array when no categories exist', async () => {
      vi.mocked(prisma.feedCategory.findMany).mockResolvedValue([])
      await expect(
        FeedService.fetchFeedCategories({ limit: 5 }),
      ).resolves.toEqual([])
    })

    it('returns categories with empty product arrays', async () => {
      vi.mocked(prisma.feedCategory.findMany).mockResolvedValue([
        { ...feedCategory, products: [] },
      ] as never)

      const result = await FeedService.fetchFeedCategories({ limit: 5 })
      expect(result[0].products).toEqual([])
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.feedCategory.findMany).mockRejectedValue(error)

      await expect(FeedService.fetchFeedCategories({ limit: 5 })).rejects.toBe(
        error,
      )
    })
  })

  describe('fetchFeedCategoryBySlug', () => {
    it('fetches a category by slug and maps its products', async () => {
      vi.mocked(prisma.feedCategory.findUnique).mockResolvedValue(
        feedCategory as never,
      )

      const result = await FeedService.fetchFeedCategoryBySlug({
        slug: 'popular',
      })

      expect(prisma.feedCategory.findUnique).toHaveBeenCalledWith({
        where: { slug: 'popular' },
        include: {
          products: {
            include: {
              category: {
                select: { name: true, iconPath: true },
              },
            },
          },
        },
      })

      expect(result).toEqual({
        id: 2,
        name: 'Popular',
        slug: 'popular',
        description: 'Popular products',
        order: 1,
        products: [product],
      })
    })

    it('returns null when the category does not exist', async () => {
      vi.mocked(prisma.feedCategory.findUnique).mockResolvedValue(null)

      await expect(
        FeedService.fetchFeedCategoryBySlug({ slug: 'missing' }),
      ).resolves.toBeNull()
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.feedCategory.findUnique).mockRejectedValue(error)

      await expect(
        FeedService.fetchFeedCategoryBySlug({ slug: 'popular' }),
      ).rejects.toBe(error)
    })
  })

  describe('fetchFeedCategoryProducts', () => {
    it('fetches active products with pagination and returns pagination metadata', async () => {
      vi.mocked(prisma.feedCategory.findUnique).mockResolvedValue({
        id: 2,
        name: 'Popular',
      } as never)
      vi.mocked(prisma.product.findMany).mockResolvedValue([product] as never)
      vi.mocked(prisma.product.count).mockResolvedValue(25)

      const result = await FeedService.fetchFeedCategoryProducts({
        slug: 'popular',
        page: 2,
        limit: 10,
      })

      expect(prisma.feedCategory.findUnique).toHaveBeenCalledWith({
        where: { slug: 'popular' },
        select: { id: true, name: true },
      })

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { feedCategoryId: 2, isActive: true },
        skip: 10,
        take: 10,
        include: {
          category: { select: { name: true, iconPath: true } },
        },
      })

      expect(prisma.product.count).toHaveBeenCalledWith({
        where: { feedCategoryId: 2, isActive: true },
      })

      expect(result).toEqual({
        category: { id: 2, name: 'Popular' },
        products: [product],
        pagination: {
          page: 2,
          limit: 10,
          total: 25,
          totalPages: 3,
        },
      })
    })

    it('uses default page and limit values', async () => {
      vi.mocked(prisma.feedCategory.findUnique).mockResolvedValue({
        id: 2,
        name: 'Popular',
      } as never)
      vi.mocked(prisma.product.findMany).mockResolvedValue([] as never)
      vi.mocked(prisma.product.count).mockResolvedValue(0)

      const result = await FeedService.fetchFeedCategoryProducts({
        slug: 'popular',
      })

      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 0, take: 12 }),
      )
      expect(result.pagination).toEqual({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      })
    })

    it('throws when the feed category does not exist', async () => {
      vi.mocked(prisma.feedCategory.findUnique).mockResolvedValue(null)

      await expect(
        FeedService.fetchFeedCategoryProducts({ slug: 'missing' }),
      ).rejects.toThrow('Feed category not found')

      expect(prisma.product.findMany).not.toHaveBeenCalled()
      expect(prisma.product.count).not.toHaveBeenCalled()
    })

    it('propagates product-query errors', async () => {
      vi.mocked(prisma.feedCategory.findUnique).mockResolvedValue({
        id: 2,
        name: 'Popular',
      } as never)

      const error = new Error('Product query failed')
      vi.mocked(prisma.product.findMany).mockRejectedValue(error)
      vi.mocked(prisma.product.count).mockResolvedValue(0)

      await expect(
        FeedService.fetchFeedCategoryProducts({ slug: 'popular' }),
      ).rejects.toBe(error)
    })

    it('propagates count-query errors', async () => {
      vi.mocked(prisma.feedCategory.findUnique).mockResolvedValue({
        id: 2,
        name: 'Popular',
      } as never)
      vi.mocked(prisma.product.findMany).mockResolvedValue([] as never)

      const error = new Error('Count query failed')
      vi.mocked(prisma.product.count).mockRejectedValue(error)

      await expect(
        FeedService.fetchFeedCategoryProducts({ slug: 'popular' }),
      ).rejects.toBe(error)
    })
  })

  describe('fetchUserFeed', () => {
    it('fetches ordered categories with the requested number of active products', async () => {
      vi.mocked(prisma.feedCategory.findMany).mockResolvedValue([
        feedCategory,
      ] as never)

      const result = await FeedService.fetchUserFeed({ limitPerCategory: 2 })

      expect(prisma.feedCategory.findMany).toHaveBeenCalledWith({
        orderBy: { order: 'asc' },
        include: {
          products: {
            take: 2,
            where: { isActive: true },
            include: {
              category: {
                select: { name: true, iconPath: true },
              },
            },
          },
        },
      })

      expect(result).toEqual([
        {
          category: { id: 2, name: 'Popular', slug: 'popular' },
          products: [product],
        },
      ])
    })

    it('uses the default limit of four products per category', async () => {
      vi.mocked(prisma.feedCategory.findMany).mockResolvedValue([])

      await FeedService.fetchUserFeed({})

      expect(prisma.feedCategory.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: {
            products: expect.objectContaining({ take: 4 }),
          },
        }),
      )
    })

    it('returns an empty array when no categories exist', async () => {
      vi.mocked(prisma.feedCategory.findMany).mockResolvedValue([])

      await expect(FeedService.fetchUserFeed({})).resolves.toEqual([])
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.feedCategory.findMany).mockRejectedValue(error)

      await expect(FeedService.fetchUserFeed({})).rejects.toBe(error)
    })
  })
})
