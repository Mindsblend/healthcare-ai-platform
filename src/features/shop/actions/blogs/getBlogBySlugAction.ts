import { GetBlogBySlugInput, GetBlogBySlugResponse } from '../../shop.types'

export async function getBlogBySlug(
  input: GetBlogBySlugInput,
): Promise<GetBlogBySlugResponse> {
  const { slug } = input
  const res = await fetch(`/api/shop/blogs/${encodeURIComponent(slug)}`)

  if (!res.ok) throw new Error('Failed to get blog')

  return res.json()
}
