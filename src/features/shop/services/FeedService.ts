// features/shop/services/FeedService.ts
import { prisma } from '@/lib/prisma'

export class FeedService {
  /**
   * Get all feed categories with their products
   * For the main user feed page
   */
  static async fetchFeedCategories() {
    return prisma.feedCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        products: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            price: true,
            solution: true,
            slug: true,
            image: true,
            categoryId: true,
            category: {
              select: {
                name: true,
                iconPath: true,
              },
            },
          },
          take: 10,
        },
      },
    })
  }

  /**
   * Get a single feed category by slug with its products
   */
  static async fetchFeedCategoryBySlug(slug: string) {
    const category = await prisma.feedCategory.findUnique({
      where: { slug },
      include: {
        products: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            price: true,
            solution: true,
            slug: true,
            image: true,
            description: true,
            categoryId: true,
            category: {
              select: {
                name: true,
                iconPath: true,
              },
            },
          },
        },
      },
    })

    if (!category) {
      return null
    }

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      products: category.products,
    }
  }

  /**
   * Get products for a specific feed category with pagination
   */
  static async fetchFeedCategoryProducts(
    slug: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit

    const category = await prisma.feedCategory.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
      },
    })

    if (!category) {
      return null
    }

    // Get products directly from the Product model
    const products = await prisma.product.findMany({
      where: {
        feedCategoryId: category.id,
        isActive: true,
      },
      select: {
        id: true,
        title: true,
        price: true,
        solution: true,
        slug: true,
        image: true,
        description: true,
        categoryId: true,
        category: {
          select: {
            name: true,
            iconPath: true,
          },
        },
      },
      skip,
      take: limit,
    })

    const totalCount = await prisma.product.count({
      where: {
        feedCategoryId: category.id,
        isActive: true,
      },
    })

    // Return without the type annotation to avoid mismatch
    return {
      category: {
        id: category.id,
        name: category.name,
      },
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  }

  /**
   * Get user feed (all categories with their products)
   */
  static async fetchUserFeed(limitPerCategory: number = 10) {
    const categories = await prisma.feedCategory.findMany({
      where: {
        products: {
          some: {
            isActive: true,
          },
        },
      },
      orderBy: { order: 'asc' },
      include: {
        products: {
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            price: true,
            solution: true,
            slug: true,
            image: true,
            categoryId: true,
            category: {
              select: {
                name: true,
                iconPath: true,
              },
            },
          },
          take: limitPerCategory,
        },
      },
    })

    // Format the response
    const formattedFeed = categories.map((category) => ({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
      products: category.products,
    }))

    return formattedFeed
  }
}
