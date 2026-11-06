import { beforeEach, describe, expect, it, vi } from 'vitest'

const { prismaMock, txMock } = vi.hoisted(() => {
  const txMock = {
    collection: {
      update: vi.fn(),
      findUnique: vi.fn(),
    },
    collectionProduct: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  }

  return {
    txMock,
    prismaMock: {
      collection: {
        findMany: vi.fn(),
        findUnique: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      $transaction: vi.fn(),
    },
  }
})

vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}))

import { prisma } from '@/lib/prisma'
import { CollectionService } from '@/features/shop/services/CollectionService'

describe('CollectionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(prisma.$transaction).mockImplementation((async (
      callback: (tx: typeof txMock) => Promise<unknown>,
    ) => {
      return callback(txMock)
    }) as never)

    txMock.collection.update.mockResolvedValue({ id: 1 })
    txMock.collection.findUnique.mockResolvedValue({ id: 1, products: [] })
    txMock.collectionProduct.deleteMany.mockResolvedValue({ count: 0 })
    txMock.collectionProduct.createMany.mockResolvedValue({ count: 0 })
  })

  describe('fetchAllCollections', () => {
    it('fetches active collections ordered by order ascending with summary fields', async () => {
      const collections = [{ id: 1, name: 'Starter', slug: 'starter' }]
      vi.mocked(prisma.collection.findMany).mockResolvedValue(
        collections as never,
      )

      const result = await CollectionService.fetchAllCollections()

      expect(prisma.collection.findMany).toHaveBeenCalledWith({
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
      expect(result).toEqual(collections)
    })

    it('returns an empty array when no active collections exist', async () => {
      vi.mocked(prisma.collection.findMany).mockResolvedValue([])

      await expect(CollectionService.fetchAllCollections()).resolves.toEqual([])
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.collection.findMany).mockRejectedValue(error)

      await expect(CollectionService.fetchAllCollections()).rejects.toBe(error)
    })
  })

  describe('fetchFeaturedCollections', () => {
    it('fetches only active featured collections in ascending order', async () => {
      vi.mocked(prisma.collection.findMany).mockResolvedValue([])

      await CollectionService.fetchFeaturedCollections()

      expect(prisma.collection.findMany).toHaveBeenCalledWith({
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
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.collection.findMany).mockRejectedValue(error)

      await expect(CollectionService.fetchFeaturedCollections()).rejects.toBe(
        error,
      )
    })
  })

  describe('fetchCollectionBySlug', () => {
    it('fetches an active collection by slug with ordered products and relations', async () => {
      const collection = { id: 1, slug: 'starter', products: [] }
      vi.mocked(prisma.collection.findUnique).mockResolvedValue(
        collection as never,
      )

      const result = await CollectionService.fetchCollectionBySlug('starter')

      expect(prisma.collection.findUnique).toHaveBeenCalledWith({
        where: { slug: 'starter', isActive: true },
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
      expect(result).toEqual(collection)
    })

    it('returns null when the active collection is not found', async () => {
      vi.mocked(prisma.collection.findUnique).mockResolvedValue(null)

      await expect(
        CollectionService.fetchCollectionBySlug('missing'),
      ).resolves.toBeNull()
    })

    it('propagates database errors', async () => {
      const error = new Error('Database unavailable')
      vi.mocked(prisma.collection.findUnique).mockRejectedValue(error)

      await expect(
        CollectionService.fetchCollectionBySlug('starter'),
      ).rejects.toBe(error)
    })
  })

  describe('createCollection', () => {
    it('creates a collection and connects valid numeric product IDs in order', async () => {
      const created = { id: 1, name: 'Starter' }
      vi.mocked(prisma.collection.create).mockResolvedValue(created as never)

      const input = {
        name: 'Starter',
        slug: 'starter',
        subtitle: 'Starter collection',
        productIds: ['12', 34, 'invalid', 0, -2],
      }

      const result = await CollectionService.createCollection(input as never)

      expect(prisma.collection.create).toHaveBeenCalledWith({
        data: {
          name: 'Starter',
          slug: 'starter',
          subtitle: 'Starter collection',
          description: '',
          image: '',
          price: 0,
          featured: false,
          order: 0,
          products: {
            create: [
              { product: { connect: { id: 12 } }, order: 0 },
              { product: { connect: { id: 34 } }, order: 1 },
            ],
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
      expect(result).toEqual(created)
    })

    it('uses supplied optional values instead of defaults', async () => {
      vi.mocked(prisma.collection.create).mockResolvedValue({ id: 2 } as never)

      await CollectionService.createCollection({
        name: 'Premium',
        slug: 'premium',
        subtitle: null,
        description: 'Details',
        image: '/premium.jpg',
        price: 49,
        featured: true,
        order: 3,
        productIds: [5],
      } as never)

      expect(prisma.collection.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: 'Details',
            image: '/premium.jpg',
            price: 49,
            featured: true,
            order: 3,
            products: {
              create: [{ product: { connect: { id: 5 } }, order: 0 }],
            },
          }),
        }),
      )
    })

    it('rejects when there are no valid product IDs', async () => {
      await expect(
        CollectionService.createCollection({
          name: 'Empty',
          slug: 'empty',
          productIds: ['invalid', 0, -1],
        } as never),
      ).rejects.toThrow('At least one valid product is required')

      expect(prisma.collection.create).not.toHaveBeenCalled()
    })

    it('propagates database errors', async () => {
      const error = new Error('Create failed')
      vi.mocked(prisma.collection.create).mockRejectedValue(error)

      await expect(
        CollectionService.createCollection({
          name: 'Starter',
          slug: 'starter',
          productIds: [1],
        } as never),
      ).rejects.toBe(error)
    })
  })

  describe('updateCollection', () => {
    it('throws when the collection does not exist', async () => {
      vi.mocked(prisma.collection.findUnique).mockResolvedValue(null)

      await expect(
        CollectionService.updateCollection({ id: 99 } as never),
      ).rejects.toThrow('Collection not found')

      expect(prisma.$transaction).not.toHaveBeenCalled()
    })

    it('updates only supplied fields and leaves product relations unchanged when productIds is omitted', async () => {
      vi.mocked(prisma.collection.findUnique).mockResolvedValue({
        id: 1,
      } as never)
      const updated = { id: 1, name: 'Renamed' }
      txMock.collection.update.mockResolvedValue(updated)

      const result = await CollectionService.updateCollection({
        id: 1,
        name: 'Renamed',
      } as never)

      expect(prisma.$transaction).toHaveBeenCalledOnce()
      expect(txMock.collection.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Renamed' },
      })
      expect(txMock.collectionProduct.deleteMany).not.toHaveBeenCalled()
      expect(txMock.collectionProduct.createMany).not.toHaveBeenCalled()
      expect(txMock.collection.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      })
      expect(result).toEqual({ id: 1, products: [] })
    })

    it('replaces product relations using valid IDs and preserves their order', async () => {
      vi.mocked(prisma.collection.findUnique).mockResolvedValue({
        id: 1,
      } as never)

      await CollectionService.updateCollection({
        id: 1,
        productIds: ['8', 'invalid', 3, 0, -4],
      } as never)

      expect(txMock.collectionProduct.deleteMany).toHaveBeenCalledWith({
        where: { collectionId: 1 },
      })
      expect(txMock.collectionProduct.createMany).toHaveBeenCalledWith({
        data: [
          { collectionId: 1, productId: 8, order: 0 },
          { collectionId: 1, productId: 3, order: 1 },
        ],
      })
    })

    it('removes existing product relations when productIds is an empty array', async () => {
      vi.mocked(prisma.collection.findUnique).mockResolvedValue({
        id: 1,
      } as never)

      await CollectionService.updateCollection({
        id: 1,
        productIds: [],
      } as never)

      expect(txMock.collectionProduct.deleteMany).toHaveBeenCalledWith({
        where: { collectionId: 1 },
      })
      expect(txMock.collectionProduct.createMany).not.toHaveBeenCalled()
    })

    it('propagates transaction errors', async () => {
      vi.mocked(prisma.collection.findUnique).mockResolvedValue({
        id: 1,
      } as never)
      const error = new Error('Transaction failed')
      txMock.collection.update.mockRejectedValue(error)

      await expect(
        CollectionService.updateCollection({ id: 1, name: 'Updated' } as never),
      ).rejects.toBe(error)
    })
  })

  describe('deleteCollection', () => {
    it('soft-deletes the collection by setting isActive to false', async () => {
      const deleted = { id: 1, isActive: false }
      vi.mocked(prisma.collection.update).mockResolvedValue(deleted as never)

      const result = await CollectionService.deleteCollection(1)

      expect(prisma.collection.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { isActive: false },
      })
      expect(result).toEqual(deleted)
    })

    it('propagates database errors', async () => {
      const error = new Error('Delete failed')
      vi.mocked(prisma.collection.update).mockRejectedValue(error)

      await expect(CollectionService.deleteCollection(1)).rejects.toBe(error)
    })
  })
})
