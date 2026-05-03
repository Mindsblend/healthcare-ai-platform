import { BlogService } from "@/features/shop/services/BlogService"

export async function POST(req: Request) {
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
