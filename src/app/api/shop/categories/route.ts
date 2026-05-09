import { CategoryService } from '@/features/shop/services/CategoryService'

export async function GET() {
  try {
    const categories = await CategoryService.fetchPreviewCategories()
    return new Response(JSON.stringify(categories), { status: 200 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch categories' }),
      {
        status: 500,
      },
    )
  }
}
