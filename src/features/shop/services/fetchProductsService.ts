import { prisma } from '@/lib/prisma'
import { ProductType } from '@/components/types/types'

export async function fetchAllProducts(): Promise<ProductType[]> {
  return prisma.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      solution: true,
      slug: true,
      image: true,
      categoryId: true,
      icons: true,
      gains: true,
      faqs: true,
    },
  })
}

export async function fetchProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      icons: true,
      gains: true,
      faqs: true,
      aiResponses: true,
      category: true,
    },
  })

  return product
}

export async function fetchProductsByCategoryId(categoryId: number) {
  return prisma.product.findMany({
    where: {
      categoryId,
    },
    include: {
      category: true,
    },
  })
}
