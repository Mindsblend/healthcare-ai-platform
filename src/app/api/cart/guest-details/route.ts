import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const MAX_PRODUCTS = 100

const requestSchema = z.object({
  productIds: z
    .array(z.number().int().positive())
    .min(1)
    .max(MAX_PRODUCTS),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { productIds } = requestSchema.parse(body)

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
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

    const foundIds = new Set(products.map((p) => p.id))

    // Include inactive/missing products as null entries so the client
    // can detect and handle them appropriately.
    const results = products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      discount: p.discount ?? null,
      discountedPrice: p.discountedPrice ?? null,
      solution: p.solution,
      slug: p.slug,
      image: p.image,
      categoryId: p.categoryId,
      category: p.category,
    }))

    return NextResponse.json({ products: results }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ورودی نامعتبر است', details: error.flatten() },
        { status: 400 },
      )
    }

    console.error('[guest-details] error:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت اطلاعات محصولات' },
      { status: 500 },
    )
  }
}
