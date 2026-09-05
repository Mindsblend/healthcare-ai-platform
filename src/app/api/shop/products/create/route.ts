import { Prisma } from '@prisma/client'

import { ProductService } from '@/features/shop/services/ProductService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST(req: Request) {
  try {
    await requireAuthority({
      requiredRole: 'ADMIN',
    })

    const data = await req.json()

    const product = await ProductService.createProduct(data)

    return new Response(JSON.stringify(product), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('[createProduct API] error:', error)

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'SLUG_ALREADY_EXISTS',
            message: 'این اسلاگ قبلاً استفاده شده است.',
          },
        }),
        {
          status: 409,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    return new Response(
      JSON.stringify({
        error: {
          code: 'CREATE_PRODUCT_FAILED',
          message:
            error instanceof Error ? error.message : 'خطا در ایجاد محصول',
        },
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
