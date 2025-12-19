import { prisma } from '@/lib/prisma'
import { ProductType } from '@/components/types/types'

export async function fetchAllProducts(): Promise<ProductType[]> {
  return prisma.product.findMany()
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
