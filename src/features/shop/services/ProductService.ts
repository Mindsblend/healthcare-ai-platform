// features/shop/products/services/productService.ts

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
    const { slug } = input
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
      categoryId,
      slug,
      solution,
      image,
      description,
      icons,
      gains,
      faqs,
    } = input

    const product = await prisma.product.create({
      data: {
        title,
        price,
        categoryId,
        slug,
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

    return product
  }

  static async updateProduct(input: UpdateProductInput) {
    const { id, ...data } = input

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
      feedCategoryId: data.feedCategoryId,
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
      await prisma.icon.deleteMany({
        where: { productId: id },
      })
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
      await prisma.gain.deleteMany({
        where: { productId: id },
      })
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
      await prisma.faq.deleteMany({
        where: { productId: id },
      })
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

  static async deleteProduct(input: DeleteProductInput) {
    const { id } = input
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    })
  }
}
