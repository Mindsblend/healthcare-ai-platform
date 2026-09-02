import { BlogService } from '@/features/shop/services/BlogService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function POST(req: Request) {
  await requireAuthority({ requiredRole: 'ADMIN' })
  try {
    const data = await req.json()
    const blog = await BlogService.createBlog(data)
    return new Response(JSON.stringify(blog), { status: 201 })
  } catch (error: any) {
    console.error('[createBlog API] error:', error)
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { status: 500 },
    )
  }
}
