import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'
import { ProductService } from '@/features/shop/services/ProductService'

describe('ProductService integration', () => {
  let categoryId: number
  let productId: number
  let productSlug: string

  beforeEach(async () => {
    const suffix = crypto.randomUUID()

    const category = await prisma.category.create({
      data: {
        name: `Product Test ${suffix}`,
        iconPath: '/test.svg',
      },
    })

    categoryId = category.id
    productSlug = `product-test-${suffix}`

    const product = await prisma.product.create({
      data: {
        title: `Product Test ${suffix}`,
        slug: productSlug,
        price: 2500,
        image: '/test-product.jpg',
        description: 'Integration test product',
        solution: 'Integration test solution',
        categoryId,
        isActive: true,
      },
    })

    productId = product.id
  })

  afterEach(async () => {
    // Find every product created in this test's category.
    const products = await prisma.product.findMany({
      where: { categoryId },
      select: { id: true },
    })

    const productIds = products.map((product) => product.id)

    // Remove related records before deleting their products.
    if (productIds.length > 0) {
      await prisma.aiResponse.deleteMany({
        where: { productId: { in: productIds } },
      })

      await prisma.icon.deleteMany({
        where: { productId: { in: productIds } },
      })

      await prisma.gain.deleteMany({
        where: { productId: { in: productIds } },
      })

      await prisma.faq.deleteMany({
        where: { productId: { in: productIds } },
      })
    }

    // Now the products can be deleted safely.
    await prisma.product.deleteMany({
      where: { categoryId },
    })

    await prisma.category.deleteMany({
      where: { id: categoryId },
    })
  })
  it('returns active products in the preview', async () => {
    const previews = await ProductService.fetchProductsPreview()

    const product = previews.find((item) => item.id === productId)

    expect(product).toBeDefined()
    expect(product?.title).toContain('Product Test')
    expect(product?.price).toBe(2500)
    expect(product?.slug).toBe(productSlug)
    expect(product?.category.name).toContain('Product Test')
  })

  it('excludes inactive products from the preview', async () => {
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    })

    const previews = await ProductService.fetchProductsPreview()

    expect(previews.some((item) => item.id === productId)).toBe(false)
  })

  it('fetches an active product by its decoded and trimmed slug', async () => {
    const product = await ProductService.fetchProductBySlug({
      slug: encodeURIComponent(` ${productSlug} `),
    })

    expect(product).not.toBeNull()
    expect(product?.id).toBe(productId)
    expect(product?.slug).toBe(productSlug)
    expect(product?.category.name).toContain('Product Test')
    expect(product?.icons).toEqual([])
    expect(product?.gains).toEqual([])
    expect(product?.faqs).toEqual([])
    expect(product?.aiResponses).toEqual([])
  })

  it('returns products belonging to the requested category', async () => {
    const products = await ProductService.fetchProductsByCategoryId({
      categoryId,
    })

    expect(products.some((product) => product.id === productId)).toBe(true)
    expect(products.every((product) => product.categoryId === categoryId)).toBe(
      true,
    )
  })

  it('creates a product with icons, gains, and FAQs', async () => {
    const suffix = crypto.randomUUID()
    const slug = `created-product-${suffix}`

    const created = await ProductService.createProduct({
      title: `Created Product ${suffix}`,
      slug,
      price: 3500,
      image: '/created-product.jpg',
      description: 'Created during integration testing',
      solution: 'Test solution',
      categoryId,
      icons: [
        {
          title: 'Hydration',
          description: 'Supports hydration',
          iconPath: '/hydration.svg',
        },
      ],
      gains: [
        {
          title: 'Softer skin',
          description: 'Helps skin feel softer',
          ingredient: 'Hyaluronic acid',
        },
      ],
      faqs: [
        {
          question: 'How is it used?',
          answer: 'Use as directed.',
        },
      ],
    })

    expect(created.slug).toBe(slug)

    const saved = await prisma.product.findUnique({
      where: { id: created.id },
      include: {
        icons: true,
        gains: true,
        faqs: true,
      },
    })

    expect(saved?.icons).toHaveLength(1)
    expect(saved?.icons[0].title).toBe('Hydration')
    expect(saved?.gains).toHaveLength(1)
    expect(saved?.gains[0].ingredient).toBe('Hyaluronic acid')
    expect(saved?.faqs).toHaveLength(1)
    expect(saved?.faqs[0].question).toBe('How is it used?')
  })

  it('rejects creating a product with an existing slug', async () => {
    await expect(
      ProductService.createProduct({
        title: `Duplicate Product ${crypto.randomUUID()}`,
        slug: productSlug,
        price: 3000,
        image: '/duplicate.jpg',
        description: 'Duplicate slug test',
        solution: 'Test solution',
        categoryId,
        icons: [],
        gains: [],
        faqs: [],
      }),
    ).rejects.toThrow('SLUG_ALREADY_EXISTS')
  })

  it('returns null when fetching an inactive product by slug', async () => {
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    })

    const product = await ProductService.fetchProductBySlug({
      slug: productSlug,
    })

    expect(product).toBeNull()
  })

  it('returns only products belonging to the requested category', async () => {
    const products = await ProductService.fetchProductsByCategoryId({
      categoryId,
    })

    expect(products.length).toBeGreaterThan(0)

    expect(products.every((product) => product.categoryId === categoryId)).toBe(
      true,
    )

    expect(products.some((product) => product.id === productId)).toBe(true)
  })

  it('rejects creating a product with an existing slug', async () => {
    const suffix = crypto.randomUUID()

    await expect(
      ProductService.createProduct({
        title: `Duplicate Slug Product ${suffix}`,
        slug: productSlug,
        price: 3500,
        image: '/duplicate-product.jpg',
        description: 'Duplicate slug integration test',
        solution: 'Test solution',
        categoryId,
        icons: [],
        gains: [],
        faqs: [],
      }),
    ).rejects.toThrow('SLUG_ALREADY_EXISTS')
  })

  it('returns null when looking up an inactive product by slug', async () => {
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    })

    const product = await ProductService.fetchProductBySlug({
      slug: productSlug,
    })

    expect(product).toBeNull()
  })
})
