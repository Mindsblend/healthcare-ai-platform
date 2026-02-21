import { prisma } from '@/lib/prisma'
import { CategoryType } from '@/components/types/types'

export class CategoryService {
  static async fetchCategories(): Promise<CategoryType[]> {
    return prisma.category.findMany({
      include: {
        products: true,
      },
    })
  }
}
