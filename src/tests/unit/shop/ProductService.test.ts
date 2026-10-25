import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ProductService } from '@/features/shop/services/ProductService'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    icon: {
      deleteMany: vi.fn(),
    },
    gain: {
      deleteMany: vi.fn(),
    },
    faq: {
      deleteMany: vi.fn(),
    },
  },
}))

describe('ProductService.fetchProductsPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches active products with preview fields', async () => {
    // Arrange
    const products = [
      {
        id: 1,
        title: 'Test Product',
        price: 100,
        discount: 10,
        discountedPrice: 90,
        solution: 'Test solution',
        slug: 'test-product',
        image: '/test.jpg',
        categoryId: 5,
        category: {
          name: 'Skincare',
          iconPath: '/icons/skincare.svg',
        },
      },
    ]

    vi.mocked(prisma.product.findMany).mockResolvedValue(products as any)

    // Act
    const result = await ProductService.fetchProductsPreview()

    // Assert
    expect(result).toEqual(products)

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: {
        isActive: true,
      },
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
  })

  it('returns an empty array when there are no active products', async () => {
    // Arrange
    vi.mocked(prisma.product.findMany).mockResolvedValue([])

    // Act
    const result = await ProductService.fetchProductsPreview()

    // Assert
    expect(result).toEqual([])
  })
})

describe('ProductService.fetchProductBySlug', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('decodes and trims the slug before querying', async () => {
    const product = {
      id: 1,
      slug: 'vitamin-c-serum',
    }

    vi.mocked(prisma.product.findFirst).mockResolvedValue(product as any)

    const result = await ProductService.fetchProductBySlug({
      slug: '  vitamin-c%20serum  ',
    })

    expect(result).toEqual(product)

    expect(prisma.product.findFirst).toHaveBeenCalledWith({
      where: {
        slug: 'vitamin-c serum',
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
  })

  it('returns null when the product does not exist', async () => {
    vi.mocked(prisma.product.findFirst).mockResolvedValue(null)

    const result = await ProductService.fetchProductBySlug({
      slug: 'missing-product',
    })

    expect(result).toBeNull()

    expect(prisma.product.findFirst).toHaveBeenCalledWith({
      where: {
        slug: 'missing-product',
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
  })
})

describe('ProductService.fetchProductsByCategoryId', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches products for the requested category', async () => {
    const products = [
      {
        id: 1,
        title: 'Product A',
        categoryId: 5,
        isActive: true,
        category: {
          id: 5,
          name: 'Skincare',
        },
      },
      {
        id: 2,
        title: 'Product B',
        categoryId: 5,
        isActive: false,
        category: {
          id: 5,
          name: 'Skincare',
        },
      },
    ]

    vi.mocked(prisma.product.findMany).mockResolvedValue(products as any)

    const result = await ProductService.fetchProductsByCategoryId({
      categoryId: 5,
    })

    expect(result).toEqual(products)

    expect(prisma.product.findMany).toHaveBeenCalledWith({
      where: {
        categoryId: 5,
      },
      include: {
        category: true,
      },
    })
  })

  it('returns an empty array when the category has no products', async () => {
    vi.mocked(prisma.product.findMany).mockResolvedValue([])

    const result = await ProductService.fetchProductsByCategoryId({
      categoryId: 999,
    })

    expect(result).toEqual([])
  })
})

describe('ProductService.createProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('trims the slug before checking for an existing product', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue({
      id: 123,
    } as any)

    await expect(
      ProductService.createProduct({
        title: 'Test Product',
        price: 100,
        categoryId: 5,
        feedCategoryId: 5,
        slug: '  test-product  ',
        solution: 'Test solution',
        image: '/test.jpg',
        description: 'Test description',
        icons: [],
        gains: [],
        faqs: [],
      }),
    ).rejects.toThrow('SLUG_ALREADY_EXISTS')

    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: {
        slug: 'test-product',
      },
      select: {
        id: true,
      },
    })

    expect(prisma.product.create).not.toHaveBeenCalled()
  })

  it('creates a product with its nested icons, gains, and faqs', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null)

    const createdProduct = {
      id: 1,
      title: 'Test Product',
      slug: 'test-product',
    }

    vi.mocked(prisma.product.create).mockResolvedValue(createdProduct as any)

    const input = {
      title: 'Test Product',
      price: 100,
      categoryId: 5,
      feedCategoryId: 7,
      slug: '  test-product  ',
      solution: 'Test solution',
      image: '/test.jpg',
      description: 'Test description',
      icons: [
        {
          id: 1,
          title: 'Hydration',
          description: 'Supports hydration',
          iconPath: '/icons/water.svg',
        },
        {
          id: 2,
          title: 'Barrier',
          description: 'Supports skin barrier',
          iconPath: null,
        },
      ],
      gains: [
        {
          id: 1,
          title: 'Hydrated skin',
          description: 'Improves hydration',
          ingredient: 'Hyaluronic Acid',
        },
      ],
      faqs: [
        {
          id: 1,
          question: 'How does it work?',
          answer: 'It hydrates the skin.',
        },
      ],
    }

    const result = await ProductService.createProduct(input)

    expect(result).toEqual(createdProduct)

    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: {
        slug: 'test-product',
      },
      select: {
        id: true,
      },
    })

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Product',
        price: 100,
        categoryId: 5,
        slug: 'test-product',
        solution: 'Test solution',
        image: '/test.jpg',
        description: 'Test description',
        icons: {
          create: [
            {
              title: 'Hydration',
              description: 'Supports hydration',
              iconPath: '/icons/water.svg',
            },
            {
              title: 'Barrier',
              description: 'Supports skin barrier',
              iconPath: null,
            },
          ],
        },
        gains: {
          create: [
            {
              title: 'Hydrated skin',
              description: 'Improves hydration',
              ingredient: 'Hyaluronic Acid',
            },
          ],
        },
        faqs: {
          create: [
            {
              question: 'How does it work?',
              answer: 'It hydrates the skin.',
            },
          ],
        },
      },
    })
  })

  it('creates a product without nested icons, gains, or faqs', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null)

    const createdProduct = {
      id: 2,
      title: 'Minimal Product',
      slug: 'minimal-product',
    }

    vi.mocked(prisma.product.create).mockResolvedValue(createdProduct as any)

    const result = await ProductService.createProduct({
      title: 'Minimal Product',
      price: 50,
      categoryId: 3,
      feedCategoryId: 4,
      slug: 'minimal-product',
      solution: 'Simple solution',
      image: '/minimal.jpg',
      description: 'Minimal description',
      icons: [],
      gains: [],
      faqs: [],
    })

    expect(result).toEqual(createdProduct)

    expect(prisma.product.create).toHaveBeenCalledWith({
      data: {
        title: 'Minimal Product',
        price: 50,
        categoryId: 3,
        slug: 'minimal-product',
        solution: 'Simple solution',
        image: '/minimal.jpg',
        description: 'Minimal description',
        icons: {
          create: [],
        },
        gains: {
          create: [],
        },
        faqs: {
          create: [],
        },
      },
    })
  })
})

describe('ProductService.updateProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws when the product does not exist and performs no updates', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue(null)

    await expect(
      ProductService.updateProduct({
        id: 999,
        title: 'Updated Product',
        price: 200,
        categoryId: 5,
        feedCategoryId: 7,
        slug: 'updated-product',
        solution: 'Updated solution',
        image: '/updated.jpg',
        description: 'Updated description',
        isActive: true,
      }),
    ).rejects.toThrow('Product not found')

    expect(prisma.product.update).not.toHaveBeenCalled()
    expect(prisma.icon.deleteMany).not.toHaveBeenCalled()
    expect(prisma.gain.deleteMany).not.toHaveBeenCalled()
    expect(prisma.faq.deleteMany).not.toHaveBeenCalled()
  })

  it('updates scalar product fields and excludes undefined values', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue({
      id: 1,
      title: 'Old Product',
      price: 100,
      categoryId: 5,
      icons: [],
      gains: [],
      faqs: [],
    } as any)

    const updatedProduct = {
      id: 1,
      title: 'Updated Product',
      price: 150,
    }

    vi.mocked(prisma.product.update).mockResolvedValue(updatedProduct as any)

    const result = await ProductService.updateProduct({
      id: 1,
      title: 'Updated Product',
      price: 150,
      categoryId: 5,
      feedCategoryId: 7,
      slug: 'updated-product',
      solution: 'Updated solution',
      image: '/updated.jpg',
      description: 'Updated description',
      isActive: true,
    })

    expect(result).toEqual(updatedProduct)

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        title: 'Updated Product',
        price: 150,
        categoryId: 5,
        feedCategoryId: 7,
        slug: 'updated-product',
        solution: 'Updated solution',
        image: '/updated.jpg',
        description: 'Updated description',
        isActive: true,
      },
      include: {
        icons: true,
        gains: true,
        faqs: true,
        category: true,
      },
    })

    expect(prisma.icon.deleteMany).not.toHaveBeenCalled()
    expect(prisma.gain.deleteMany).not.toHaveBeenCalled()
    expect(prisma.faq.deleteMany).not.toHaveBeenCalled()
  })

  it('replaces nested icons, gains, and faqs when provided', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue({
      id: 1,
      icons: [],
      gains: [],
      faqs: [],
    } as any)

    vi.mocked(prisma.icon.deleteMany).mockResolvedValue({ count: 2 })
    vi.mocked(prisma.gain.deleteMany).mockResolvedValue({ count: 3 })
    vi.mocked(prisma.faq.deleteMany).mockResolvedValue({ count: 4 })

    const updatedProduct = {
      id: 1,
      title: 'Updated Product',
    }

    vi.mocked(prisma.product.update).mockResolvedValue(updatedProduct as any)

    const result = await ProductService.updateProduct({
      id: 1,
      title: 'Updated Product',
      icons: [
        {
          title: 'Hydration',
          description: 'Supports hydration',
          iconPath: null,
        },
      ],
      gains: [
        {
          title: 'Hydration',
          description: 'Improves hydration',
          ingredient: 'Hyaluronic Acid',
        },
      ],
      faqs: [
        {
          question: 'How does it work?',
          answer: 'It hydrates the skin.',
        },
      ],
    })

    expect(result).toEqual(updatedProduct)

    expect(prisma.icon.deleteMany).toHaveBeenCalledWith({
      where: {
        productId: 1,
      },
    })

    expect(prisma.gain.deleteMany).toHaveBeenCalledWith({
      where: {
        productId: 1,
      },
    })

    expect(prisma.faq.deleteMany).toHaveBeenCalledWith({
      where: {
        productId: 1,
      },
    })

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        title: 'Updated Product',
        icons: {
          create: [
            {
              title: 'Hydration',
              description: 'Supports hydration',
              iconPath: null,
            },
          ],
        },
        gains: {
          create: [
            {
              title: 'Hydration',
              description: 'Improves hydration',
              ingredient: 'Hyaluronic Acid',
            },
          ],
        },
        faqs: {
          create: [
            {
              question: 'How does it work?',
              answer: 'It hydrates the skin.',
            },
          ],
        },
      },
      include: {
        icons: true,
        gains: true,
        faqs: true,
        category: true,
      },
    })
  })

  it('only replaces nested relations that are explicitly provided', async () => {
    vi.mocked(prisma.product.findUnique).mockResolvedValue({
      id: 1,
      icons: [],
      gains: [],
      faqs: [],
    } as any)

    vi.mocked(prisma.icon.deleteMany).mockResolvedValue({ count: 1 })

    const updatedProduct = {
      id: 1,
      title: 'Updated Product',
    }

    vi.mocked(prisma.product.update).mockResolvedValue(updatedProduct as any)

    await ProductService.updateProduct({
      id: 1,
      title: 'Updated Product',
      icons: [
        {
          title: 'New Icon',
          description: 'New icon description',
          iconPath: '/icons/new.svg',
        },
      ],
    })

    expect(prisma.icon.deleteMany).toHaveBeenCalledWith({
      where: {
        productId: 1,
      },
    })

    expect(prisma.gain.deleteMany).not.toHaveBeenCalled()
    expect(prisma.faq.deleteMany).not.toHaveBeenCalled()

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: {
        id: 1,
      },
      data: {
        title: 'Updated Product',
        icons: {
          create: [
            {
              title: 'New Icon',
              description: 'New icon description',
              iconPath: '/icons/new.svg',
            },
          ],
        },
      },
      include: {
        icons: true,
        gains: true,
        faqs: true,
        category: true,
      },
    })
  })
})

describe('ProductService.deleteProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-01-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('soft deletes the product and replaces its slug', async () => {
    const updatedProduct = {
      id: 42,
      isActive: false,
      slug: 'deleted-42-1768478400000',
    }

    vi.mocked(prisma.product.update).mockResolvedValue(updatedProduct as any)

    const result = await ProductService.deleteProduct({
      id: 42,
    })

    expect(result).toEqual(updatedProduct)

    expect(prisma.product.update).toHaveBeenCalledWith({
      where: {
        id: 42,
      },
      data: {
        isActive: false,
        slug: 'deleted-42-1768478400000',
      },
    })
  })
})
