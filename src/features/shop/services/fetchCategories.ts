import { prisma } from '@/lib/prisma'
import { CategoryType } from '@/components/types/types'

export async function fetchCategories(): Promise<CategoryType[]> {
  return prisma.category.findMany({
    include: {
      products: true,
    },
  })
}
