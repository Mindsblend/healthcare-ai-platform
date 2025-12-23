import { fetchCategories } from '@/features/shop/services/fetchCategories'

export async function GET() {
  try {
    const categories = await fetchCategories()
    return new Response(JSON.stringify(categories), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), {
      status: 500,
    })
  }
}
