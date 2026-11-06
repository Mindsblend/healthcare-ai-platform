import { prisma } from '@/lib/prisma'
import {
  ProductSummary,
  ProductDetail,
  CreateProductInput,
  UpdateProductInput,
  DeleteProductInput,
  GetProductBySlugInput,
  GetProductsByCategoryInput,
} from '../shop.types'

/**
 * Calculate the discounted price on the server.
 * Returns null when no discount is applied.
 */
function calculateDiscountedPrice(
  price: number,
  discount?: number | null,
): number | null {
  const normalizedDiscount = discount ?? 0

  if (!Number.isInteger(price) || price < 0) {
    throw new Error('INVALID_PRODUCT_PRICE')
  }

  if (
    !Number.isInteger(normalizedDiscount) ||
    normalizedDiscount < 0 ||
    normalizedDiscount > 100
  ) {
    throw new Error('INVALID_PRODUCT_DISCOUNT')
  }

  if (normalizedDiscount === 0) {
    return null
  }

  return Math.round(price * (1 - normalizedDiscount / 100))
}

export class ProductService {
  static async fetchProductsPreview(): Promise<ProductSummary[]> {
    return prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        price: true,
        discount: true,
        discountedPrice: true,
        solution: true,
        slug: true,
        image: true,
        categoryId: true,
        category: {
          select: {
            name: true,
            iconPath: true,
          },
        },
      },
    })
  }

  static async fetchProductBySlug(
    input: GetProductBySlugInput,
  ): Promise<ProductDetail | null> {
    const slug = decodeURIComponent(input.slug).trim()

    return prisma.product.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        icons: true,
        gains: true,
        faqs: true,
        aiResponses: true,
        category: true,
      },
    })
  }

  static async fetchProductsByCategoryId(input: GetProductsByCategoryInput) {
    const { categoryId } = input

    return prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        category: true,
      },
    })
  }

  static async createProduct(input: CreateProductInput) {
    const {
      title,
      price,
      discount,
      categoryId,
      slug,
      solution,
      image,
      description,
      icons,
      gains,
      faqs,
    } = input

    const normalizedSlug = slug.trim()
    const normalizedDiscount = discount ?? 0

    const discountedPrice = calculateDiscountedPrice(price, normalizedDiscount)

    const existingProduct = await prisma.product.findUnique({
      where: {
        slug: normalizedSlug,
      },
      select: {
        id: true,
      },
    })

    if (existingProduct) {
      throw new Error('SLUG_ALREADY_EXISTS')
    }

    return prisma.product.create({
      data: {
        title,
        price,
        discount: normalizedDiscount,
        discountedPrice,
        categoryId,
        slug: normalizedSlug,
        solution,
        image,
        description,

        icons: {
          create: icons.map((i) => ({
            title: i.title,
            description: i.description,
            iconPath: i.iconPath ?? null,
          })),
        },

        gains: {
          create: gains.map((g) => ({
            title: g.title,
            description: g.description,
            ingredient: g.ingredient,
          })),
        },

        faqs: {
          create: faqs.map((f) => ({
            question: f.question,
            answer: f.answer,
          })),
        },
      },
    })
  }

  static async updateProduct(input: UpdateProductInput) {
    const { id, ...data } = input

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

    const updateData: any = {
      title: data.title,
      price: data.price,
      categoryId: data.categoryId,
      feedCategoryId: data.feedCategoryId,
      slug: data.slug,
      solution: data.solution,
      image: data.image,
      description: data.description,
      isActive: data.isActive,
    }

    // Remove undefined values.
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    )

    // Recalculate discount whenever price or discount changes.
    if (data.price !== undefined || data.discount !== undefined) {
      const nextPrice = data.price ?? existingProduct.price
      const nextDiscount = data.discount ?? existingProduct.discount ?? 0

      updateData.price = nextPrice
      updateData.discount = nextDiscount
      updateData.discountedPrice = calculateDiscountedPrice(
        nextPrice,
        nextDiscount,
      )
    }

    // Update icons if provided.
    if (data.icons) {
      updateData.icons = {
        deleteMany: {},
        create: data.icons.map((i) => ({
          title: i.title,
          description: i.description,
          iconPath: i.iconPath ?? null,
        })),
      }
    }

    // Update gains if provided.
    if (data.gains) {
      updateData.gains = {
        deleteMany: {},
        create: data.gains.map((g) => ({
          title: g.title,
          description: g.description,
          ingredient: g.ingredient,
        })),
      }
    }

    // Update FAQs if provided.
    if (data.faqs) {
      updateData.faqs = {
        deleteMany: {},
        create: data.faqs.map((f) => ({
          question: f.question,
          answer: f.answer,
        })),
      }
    }

    return prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        icons: true,
        gains: true,
        faqs: true,
        category: true,
      },
    })
  }

  static async deleteProduct(input: DeleteProductInput) {
    const { id } = input

    return prisma.product.update({
      where: { id },
      data: {
        isActive: false,
        slug: `deleted-${id}-${Date.now()}`,
      },
    })
  }
}
