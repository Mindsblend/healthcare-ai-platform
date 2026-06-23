// features/shop/services/FeedService.ts

import { prisma } from '@/lib/prisma'
import {
  FetchFeedCategoriesInput,
  FetchFeedCategoryBySlugInput,
  FetchFeedCategoryProductsInput,
  FetchUserFeedInput,
  FeedCategoryWithProducts,
  FeedCategoryProduct,
  FeedCategoryProductsResponse,
  UserFeedResponse,
} from '../shop.types'

export class FeedService {
  static async fetchFeedCategories(input: FetchFeedCategoriesInput): Promise<FeedCategoryWithProducts[]> {
    const { limit } = input

    const categories = await prisma.feedCategory.findMany({
      take: limit,
      orderBy: { order: 'asc' },
      include: {
        products: {
          include: {
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

    return categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      order: category.order,
      products: category.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        solution: product.solution,
        slug: product.slug,
        image: product.image,
        description: product.description,
        categoryId: product.categoryId,
        category: product.category,
      })),
    }))
  }

  static async fetchFeedCategoryBySlug(input: FetchFeedCategoryBySlugInput) {
    const { slug } = input

    const category = await prisma.feedCategory.findUnique({
      where: { slug },
      include: {
        products: {
          include: {
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

    if (!category) return null

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      order: category.order,
      products: category.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        solution: product.solution,
        slug: product.slug,
        image: product.image,
        description: product.description,
        categoryId: product.categoryId,
        category: product.category,
      })),
    }
  }

  static async fetchFeedCategoryProducts(
    input: FetchFeedCategoryProductsInput
  ): Promise<FeedCategoryProductsResponse> {
    const { slug, page = 1, limit = 12 } = input

    const category = await prisma.feedCategory.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
      },
    })

    if (!category) {
      throw new Error('Feed category not found')
    }

    const skip = (page - 1) * limit

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: {
          feedCategoryId: category.id,
          isActive: true,
        },
        skip,
        take: limit,
        include: {
          category: {
            select: {
              name: true,
              iconPath: true,
            },
          },
        },
      }),
      prisma.product.count({
        where: {
          feedCategoryId: category.id,
          isActive: true,
        },
      }),
    ])

    return {
      category: {
        id: category.id,
        name: category.name,
      },
      products: products.map((product: any) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        solution: product.solution,
        slug: product.slug,
        image: product.image,
        description: product.description,
        categoryId: product.categoryId,
        category: product.category,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  
  static async fetchUserFeed(input: FetchUserFeedInput): Promise<UserFeedResponse> {
    const { limitPerCategory = 4 } = input

    const categories = await prisma.feedCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        products: {
          take: limitPerCategory,
          where: {
            isActive: true,
          },
          include: {
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

    return categories.map((category: any) => ({
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
      products: category.products.map((product: any) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        solution: product.solution,
        slug: product.slug,
        image: product.image,
        description: product.description,
        categoryId: product.categoryId,
        category: product.category,
      })),
    }))
  }
}