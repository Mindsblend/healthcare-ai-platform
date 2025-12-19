import { fetchBlogs } from '@/features/shop/services/fetchBlogs'

export async function GET() {
  try {
    const blogs = await fetchBlogs()
    return new Response(JSON.stringify(blogs), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), {
      status: 500,
    })
  }
}
