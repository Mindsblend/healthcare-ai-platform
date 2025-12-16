// features/shop/services/productService.ts
import { prisma } from '@/lib/prisma'
import { ProductType } from '@/components/types/types'

export async function fetchProducts(): Promise<ProductType[]> {
  return prisma.product.findMany()
}
