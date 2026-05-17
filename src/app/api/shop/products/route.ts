import { NextRequest, NextResponse } from 'next/server'
import { ProductService } from '@/features/shop/services/ProductService'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const categoryId = searchParams.get('categoryId')

    // If categoryId is provided, filter products by category
    if (categoryId) {
      const products = await ProductService.fetchProductsByCategoryId({
        categoryId: Number(categoryId),
      })
      return NextResponse.json(products)
    }

    // Otherwise return all products
    const products = await ProductService.fetchProductsPreview()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    )
  }
}
