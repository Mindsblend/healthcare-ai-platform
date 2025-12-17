import { prisma } from '@/lib/prisma'
import { ProductType } from '@/components/types/types'

export async function fetchAllProducts(): Promise<ProductType[]> {
  return prisma.product.findMany()
}

export async function fetchProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
  })

  if (!product) throw new Error('Product not found')

  return product
}
