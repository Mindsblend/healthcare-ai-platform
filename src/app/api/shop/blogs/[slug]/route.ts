import { NextRequest } from 'next/server'
import { BlogService } from '@/features/shop/services/BlogService'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug: rawSlug } = await params
    const slug = decodeURIComponent(rawSlug)

    const blog = await BlogService.fetchBlogBySlug({ slug })

    if (!blog) {
      return new Response(JSON.stringify({ error: 'Blog not found' }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(blog), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch blog' }), {
      status: 500,
    })
  }
}
