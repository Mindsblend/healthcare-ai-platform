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

interface UpdateProductDTO {
  title?: string
  price?: number
  slug?: string
  solution?: string
  image?: string
  description?: string
  categoryId?: number
  isActive?: boolean
  icons?: iconType[]
  gains?: gainType[]
  faqs?: faqType[]
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

  static async updateProduct(id: number, data: UpdateProductDTO) {
    // First, get the existing product to handle nested updates
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        icons: true,
        gains: true,
        faqs: true,
      },
    })

    if (!existingProduct) {
      throw new Error('Product not found')
    }

    // Prepare update data
    const updateData: any = {
      title: data.title,
      price: data.price,
      categoryId: data.categoryId,
      slug: data.slug,
      solution: data.solution,
      image: data.image,
      description: data.description,
      isActive: data.isActive,
    }

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    )

    // Update icons if provided
    if (data.icons) {
      // Delete existing icons
      await prisma.icon.deleteMany({
        where: { productId: id },
      })
      // Create new icons
      updateData.icons = {
        create: data.icons.map((i) => ({
          title: i.title,
          description: i.description,
          iconPath: i.iconPath ?? null,
        })),
      }
    }

    // Update gains if provided
    if (data.gains) {
      // Delete existing gains
      await prisma.gain.deleteMany({
        where: { productId: id },
      })
      // Create new gains
      updateData.gains = {
        create: data.gains.map((g) => ({
          title: g.title,
          description: g.description,
          ingredient: g.ingredient,
        })),
      }
    }

    // Update faqs if provided
    if (data.faqs) {
      // Delete existing faqs
      await prisma.faq.deleteMany({
        where: { productId: id },
      })
      // Create new faqs
      updateData.faqs = {
        create: data.faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        icons: true,
        gains: true,
        faqs: true,
        category: true,
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
