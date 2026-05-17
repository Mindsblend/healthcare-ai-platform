// features/shop/categories/services/feedService.ts

import { prisma } from '@/lib/prisma'
import {
  FetchFeedCategoriesInput,
  FetchFeedCategoryBySlugInput,
  FetchFeedCategoryProductsInput,
  FetchUserFeedInput,
  FeedCategoryWithProducts,
  FeedCategoryProductsResponse,
  UserFeedResponse,
} from '../shop.types'

export class FeedService {
  /**
   * Get all feed categories with their products
   * For the main user feed page
   */
  static async fetchFeedCategories(
    input?: FetchFeedCategoriesInput,
  ): Promise<FeedCategoryWithProducts[]> {
    const limit = input?.limit || 10
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
          take: limit,
        },
      },
    })
  }

  /**
   * Get a single feed category by slug with its products
   */
  static async fetchFeedCategoryBySlug(
    input: FetchFeedCategoryBySlugInput,
  ): Promise<FeedCategoryWithProducts | null> {
    const { slug } = input
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
      order: category.order,
      description: category.description,
      products: category.products,
    }
  }

  /**
   * Get products for a specific feed category with pagination
   */
  static async fetchFeedCategoryProducts(
    input: FetchFeedCategoryProductsInput,
  ): Promise<FeedCategoryProductsResponse | null> {
    const { slug, page = 1, limit = 20 } = input
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
  static async fetchUserFeed(
    input?: FetchUserFeedInput,
  ): Promise<UserFeedResponse> {
    const limitPerCategory = input?.limitPerCategory || 10

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

    return categories.map((category) => ({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
      products: category.products,
    }))
  }
}
