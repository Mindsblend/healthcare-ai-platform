import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAuthority } from '@/features/auth/services/sessionService'
import { prisma } from '@/lib/prisma'

const MAX_CART_ITEMS = 100
const MAX_QUANTITY_PER_ITEM = 99

const requestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().min(1).max(MAX_QUANTITY_PER_ITEM),
      }),
    )
    .min(1)
    .max(MAX_CART_ITEMS),
})

export async function POST(req: NextRequest) {
  const session = await requireAuthority({ requiredRole: 'USER' })

  try {
    const body = await req.json()
    const { items } = requestSchema.parse(body)

    return await prisma.$transaction(async (tx) => {
      // Get or create user's active cart
      let cart = await tx.cart.findFirst({
        where: {
          userId: session.id,
          status: 'ACTIVE',
        },
      })

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            userId: session.id,
            status: 'ACTIVE',
          },
        })
      }

      // Validate products exist and are active
      const productIds = items.map((i) => i.productId)
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          isActive: true,
        },
        select: { id: true },
      })
      const validProductIds = new Set(products.map((p) => p.id))

      // Upsert each valid item into the cart
      for (const item of items) {
        if (!validProductIds.has(item.productId)) {
          continue
        }

        await tx.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: item.productId,
            },
          },
          update: {
            quantity: {
              increment: item.quantity,
            },
          },
          create: {
            cartId: cart.id,
            productId: item.productId,
            quantity: item.quantity,
            price: 0, // Price will be corrected on checkout from product data
          },
        })
      }

      // Return the merged cart with items and product details
      const mergedCart = await tx.cart.findFirst({
        where: { id: cart.id },
        include: {
          items: {
            orderBy: { id: 'asc' },
            include: {
              product: {
                include: {
                  category: {
                    select: { name: true, iconPath: true },
                  },
                },
              },
            },
          },
        },
      })

      if (!mergedCart) {
        throw new Error('Failed to retrieve merged cart')
      }

      return NextResponse.json(
        {
          success: true,
          cart: {
            id: mergedCart.id,
            userId: mergedCart.userId,
            status: mergedCart.status,
            items: mergedCart.items.map((item) => ({
              id: item.id,
              cartId: item.cartId,
              quantity: item.quantity,
              price: item.price,
              product: {
                id: item.product.id,
                title: item.product.title,
                price: item.product.price,
                discount: item.product.discount ?? null,
                discountedPrice: item.product.discountedPrice ?? null,
                solution: item.product.solution,
                slug: item.product.slug,
                image: item.product.image,
                categoryId: item.product.categoryId,
                category: item.product.category,
              },
            })),
          },
        },
        { status: 200 },
      )
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'ورودی نامعتبر است', details: error.flatten() },
        { status: 400 },
      )
    }

    console.error('[cart/merge] error:', error)
    return NextResponse.json(
      { error: 'خطا در ادغام سبد خرید، لطفا دوباره تلاش کنید.' },
      { status: 500 },
    )
  }
}
