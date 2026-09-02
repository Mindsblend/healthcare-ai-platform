import { GetBlogsPreviewResponse } from '../../shop.types'

export async function getBlogsPreview(): Promise<GetBlogsPreviewResponse> {
  const res = await fetch('/api/shop/blogs')
  if (!res.ok) throw new Error('Failed to get blogs')
  return res.json()
}
