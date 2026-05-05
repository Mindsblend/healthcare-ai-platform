import { prisma } from '@/lib/prisma'
import {
  ProductSummary,
  iconType,
  gainType,
  faqType,
} from '@/components/types/types'

interface CreateProductDTO {
  title: string
  price: number
  slug: string
  solution: string
  image: string
  description: string
  categoryId: number
  icons: iconType[]
  gains: gainType[]
  faqs: faqType[]
}

export class ProductService {
  static async fetchPreviewProducts(): Promise<ProductSummary[]> {
    return prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        price: true,
        solution: true,
        slug: true,
        image: true,
        categoryId: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    })
  }

  static async fetchProductBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        icons: true,
        gains: true,
        faqs: true,
        aiResponses: true,
        category: true,
      },
    })
  }

  static async fetchProductsByCategoryId(categoryId: number) {
    return prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
      },
    })
  }

  static async createProduct(data: CreateProductDTO) {
    const product = await prisma.product.create({
      data: {
        title: data.title,
        price: data.price,

        categoryId: data.categoryId,

        slug: data.slug,
        solution: data.solution,
        image: data.image,
        description: data.description,

        icons: {
          create: data.icons.map((i) => ({
            title: i.title,
            description: i.description,
            iconPath: i.iconPath ?? null,
          })),
        },

        gains: {
          create: data.gains.map((g) => ({
            title: g.title,
            description: g.description,
            ingredient: g.ingredient,
          })),
        },

        faqs: {
          create: data.faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          })),
        },
      },
    })

    return product
  }

  static async deleteProduct(id: number) {
    return prisma.product.update({
      where: { id: id },
      data: { isActive: false },
    })
  }
}
