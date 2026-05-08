import { BlogService } from '@/features/shop/services/BlogService'
import { requireAuthority } from '@/features/auth/services/sessionService'

export async function DELETE(req: Request) {
  await requireAuthority('ADMIN')
  try {
    const data = await req.json()
    const blog = await BlogService.deleteBlog(data)
    return new Response(JSON.stringify(blog), { status: 201 })
  } catch (error: any) {
    console.error('[deleteBlog API] error:', error)
    return new Response(
      JSON.stringify({ error: error.message || String(error) }),
      { status: 500 },
    )
  }
}
