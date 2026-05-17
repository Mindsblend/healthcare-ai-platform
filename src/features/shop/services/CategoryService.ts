// features/shop/categories/services/categoryService.ts

import { prisma } from '@/lib/prisma'
import {
  CategorySummary,
  CategoryWithProducts,
  FetchCategoryWithProductsInput,
} from '../shop.types'

export class CategoryService {
  // Returns ONLY categories (no products)
  static async fetchPreviewCategories(): Promise<CategorySummary[]> {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        iconPath: true,
      },
    })
  }

  // Returns category WITH its products (for category page)
  static async fetchCategoryWithProducts(
    input: FetchCategoryWithProductsInput,
  ): Promise<CategoryWithProducts | null> {
    const { id } = input
    return prisma.category.findUnique({
      where: { id },
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
    })
  }
}
