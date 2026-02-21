import { BlogService } from '@/features/shop/services/BlogService'

export async function GET() {
  try {
    const blogs = await BlogService.fetchBlogs()
    return new Response(JSON.stringify(blogs), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch blogs' }), {
      status: 500,
    })
  }
}
