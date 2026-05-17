import { CreateBlogInput, CreateBlogResponse } from '../../shop.types'

export async function createBlog(
  input: CreateBlogInput,
): Promise<CreateBlogResponse> {
  const response = await fetch('/api/shop/blogs/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })

  let data: any = null

  try {
    data = await response.json()
  } catch {
    throw new Error('INVALID_SERVER_RESPONSE')
  }

  if (!response.ok) {
    if (data?.error?.code === 'P2002') {
      throw new Error('BLOG_SLUG_ALREADY_EXISTS')
    }

    throw new Error(data?.error?.message || 'CREATE_BLOG_FAILED')
  }

  return data
}
