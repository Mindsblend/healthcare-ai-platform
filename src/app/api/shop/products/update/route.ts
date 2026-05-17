import { requireAuthority } from '@/features/auth/services/sessionService'
import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/features/shop/services/ProductService'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const {
      productId,
      title,
      price,
      slug,
      solution,
      image,
      description,
      categoryId,
      feedCategoryId,
      isActive,
      icons,
      gains,
      faqs,
    } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 },
      )
    }

    await requireAuthority({ requiredRole: 'ADMIN' })

    // Create allowed updates object (only include fields that are provided)
    const allowedUpdates: any = {}
    if (title !== undefined) allowedUpdates.title = title
    if (price !== undefined) allowedUpdates.price = price
    if (slug !== undefined) allowedUpdates.slug = slug
    if (solution !== undefined) allowedUpdates.solution = solution
    if (image !== undefined) allowedUpdates.image = image
    if (description !== undefined) allowedUpdates.description = description
    if (categoryId !== undefined) allowedUpdates.categoryId = categoryId
    if (feedCategoryId !== undefined)
      allowedUpdates.feedCategoryId = feedCategoryId
    if (icons !== undefined) allowedUpdates.icons = icons
    if (gains !== undefined) allowedUpdates.gains = gains
    if (faqs !== undefined) allowedUpdates.faqs = faqs

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates provided' },
        { status: 400 },
      )
    }

    const updatedProduct = await ProductService.updateProduct({
      productId,
      ...allowedUpdates,
    })
    return NextResponse.json(updatedProduct)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 },
    )
  }
}
