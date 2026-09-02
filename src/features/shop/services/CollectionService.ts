// features/shop/collections/services/collectionService.ts

import { prisma } from '@/lib/prisma'
import {
  CollectionSummary,
  CollectionDetail,
  CreateCollectionInput,
  UpdateCollectionInput,
} from '../shop.types'

export class CollectionService {
  // Get all collections
  static async fetchAllCollections(): Promise<CollectionSummary[]> {
    return prisma.collection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        subtitle: true,
        description: true,
        image: true,
        price: true,
        featured: true,
        order: true,
        isActive: true,
        createdAt: true,
      },
    })
  }

  // Get featured collections
  static async fetchFeaturedCollections(): Promise<CollectionSummary[]> {
    return prisma.collection.findMany({
      where: { isActive: true, featured: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        subtitle: true,
        description: true,
        image: true,
        price: true,
        featured: true,
        order: true,
        isActive: true,
        createdAt: true,
      },
    })
  }

  // Get collection by slug
  static async fetchCollectionBySlug(
    slug: string,
  ): Promise<CollectionDetail | null> {
    return prisma.collection.findUnique({
      where: {
        slug: slug,
        isActive: true,
      },
      include: {
        products: {
          orderBy: { order: 'asc' },
          include: {
            product: {
              include: {
                category: true,
                feedCategory: true,
              },
            },
          },
        },
      },
    })
  }

  // Create collection
  static async createCollection(input: CreateCollectionInput) {
    const { productIds, ...data } = input

    // Convert productIds to numbers and filter out undefined/null
    const validProductIds = productIds
      .map((id) => Number(id))
      .filter((id) => !isNaN(id) && id > 0)

    if (validProductIds.length === 0) {
      throw new Error('At least one valid product is required')
    }

    return prisma.collection.create({
      data: {
        name: data.name,
        slug: data.slug,
        subtitle: data.subtitle,
        description: data.description ?? '',
        image: data.image ?? '',
        price: data.price ?? 0,
        featured: data.featured ?? false,
        order: data.order ?? 0,
        products: {
          create: validProductIds.map((productId, index) => ({
            product: {
              connect: { id: productId },
            },
            order: index,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    })
  }

  // Update collection
  static async updateCollection(input: UpdateCollectionInput) {
    const { id, productIds, ...data } = input

    // Get current collection
    const current = await prisma.collection.findUnique({ where: { id } })
    if (!current) throw new Error('Collection not found')

    // ✅ Build updateData conditionally to avoid undefined values
    const updateData: {
      name?: string
      slug?: string
      subtitle?: string | null
      description?: string
      image?: string
      price?: number
      featured?: boolean
      order?: number
      isActive?: boolean
    } = {}

    if (data.name !== undefined) updateData.name = data.name
    if (data.slug !== undefined) updateData.slug = data.slug
    if (data.subtitle !== undefined) updateData.subtitle = data.subtitle
    if (data.description !== undefined)
      updateData.description = data.description
    if (data.image !== undefined) updateData.image = data.image
    if (data.price !== undefined) updateData.price = data.price
    if (data.featured !== undefined) updateData.featured = data.featured
    if (data.order !== undefined) updateData.order = data.order
    if (data.isActive !== undefined) updateData.isActive = data.isActive

    // Convert productIds to numbers and filter
    const validProductIds =
      productIds
        ?.map((id) => Number(id))
        .filter((id) => !isNaN(id) && id > 0) ?? []

    // Update collection and products in transaction
    return prisma.$transaction(async (tx) => {
      const collection = await tx.collection.update({
        where: { id },
        data: updateData,
      })

      // Update products if provided
      if (productIds !== undefined) {
        // Delete existing relations
        await tx.collectionProduct.deleteMany({
          where: { collectionId: id },
        })

        // Create new relations
        if (validProductIds.length > 0) {
          await tx.collectionProduct.createMany({
            data: validProductIds.map((productId, index) => ({
              collectionId: id,
              productId: productId,
              order: index,
            })),
          })
        }
      }

      // Return updated collection with products
      return tx.collection.findUnique({
        where: { id },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      })
    })
  }

  // Delete collection (soft delete)
  static async deleteCollection(id: number) {
    return prisma.collection.update({
      where: { id },
      data: { isActive: false },
    })
  }
}
