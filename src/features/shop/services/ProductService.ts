import { prisma } from '@/lib/prisma'
import {
  iconType,
  gainType,
  faqType,
  ProductSummary
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
  static async fetchAllProducts(): Promise<ProductSummary[]> {
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

  static async fetchProductBySlug(slug: string) {
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
}
