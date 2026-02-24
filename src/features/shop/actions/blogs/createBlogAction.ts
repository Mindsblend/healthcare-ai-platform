
export interface CreateBlogPayload {
  title: string,
  image: string,
  description: string,
  author: string,
  authorImage: string
}

export interface CreateBlogResponse {
  id: number
  title: string
}

export async function createBlog(
  blog: CreateBlogPayload
): Promise<CreateBlogResponse> {
  const response = await fetch('/api/shop/blogs/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(blog),
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