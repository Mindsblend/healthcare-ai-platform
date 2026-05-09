import { prisma } from '@/lib/prisma'

export class CategoryService {
  // Returns ONLY categories (no products)
  static async fetchPreviewCategories() {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        iconPath: true,
      },
    })
  }

  // Returns category WITH its products (for category page)
  static async fetchCategoryWithProducts(id: number) {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          // Products are included here
          where: { isActive: true },
          select: {
            id: true,
            title: true,
            price: true,
            slug: true,
            image: true,
          },
        },
      },
    })
  }
}
