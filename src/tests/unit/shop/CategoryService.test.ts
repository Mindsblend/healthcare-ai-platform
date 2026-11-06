import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'
import { CategoryService } from '@/features/shop/services/CategoryService'

describe('CategoryService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchPreviewCategories', () => {
    it('fetches only the category summary fields', async () => {
      const categories = [
        { id: 1, name: 'Skincare', iconPath: '/icons/skincare.svg' },
        {
          id: 2,
          name: 'Nutrition',
          iconPath: '/icons/nutrition.svg',
        },
      ]

      vi.mocked(prisma.category.findMany).mockResolvedValue(categories as never)

      const result = await CategoryService.fetchPreviewCategories()

      expect(prisma.category.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          iconPath: true,
        },
      })
      expect(result).toEqual(categories)
    })

    it('returns an empty array when there are no categories', async () => {
      vi.mocked(prisma.category.findMany).mockResolvedValue([])

      await expect(CategoryService.fetchPreviewCategories()).resolves.toEqual(
        [],
      )
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.category.findMany).mockRejectedValue(error)

      await expect(CategoryService.fetchPreviewCategories()).rejects.toBe(error)
    })
  })

  describe('fetchCategoryWithProducts', () => {
    const expectedQuery = {
      where: { id: 1 },
      include: {
        products: {
          where: { isActive: true },
          include: {
            category: {
              select: {
                id: true,
                name: true,
                iconPath: true,
              },
            },
            icons: true,
            gains: true,
            faqs: true,
          },
        },
      },
    }

    it('fetches a category by ID with active products and their related data', async () => {
      const category = {
        id: 1,
        name: 'Skincare',
        iconPath: '/icons/skincare.svg',
        products: [
          {
            id: 1,
            isActive: true,
            category: {
              id: 1,
              name: 'Skincare',
              iconPath: '/icons/skincare.svg',
            },
            icons: [],
            gains: [],
            faqs: [],
          },
        ],
      }

      vi.mocked(prisma.category.findUnique).mockResolvedValue(category as never)

      const result = await CategoryService.fetchCategoryWithProducts({
        id: 1,
      })

      expect(prisma.category.findUnique).toHaveBeenCalledWith(expectedQuery)
      expect(result).toEqual(category)
    })

    it('returns null when the category does not exist', async () => {
      vi.mocked(prisma.category.findUnique).mockResolvedValue(null)

      const result = await CategoryService.fetchCategoryWithProducts({
        id: 999,
      })

      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        ...expectedQuery,
        where: { id: 999 },
      })
      expect(result).toBeNull()
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.category.findUnique).mockRejectedValue(error)

      await expect(
        CategoryService.fetchCategoryWithProducts({ id: 1 }),
      ).rejects.toBe(error)
    })
  })
})
