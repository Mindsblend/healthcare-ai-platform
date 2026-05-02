import { prisma } from '@/lib/prisma'
import { CategoryWithProducts } from '@/components/types/types'

export class CategoryService {
  static async fetchCategories(): Promise<CategoryWithProducts[]> {
    return prisma.category.findMany({
      include: {
        products: {
          include: {
            category: true,
            icons: true,
            gains: true,
            faqs: true,
          },
        },
      },
    })
  }
}
