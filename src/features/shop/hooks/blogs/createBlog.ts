import { useState } from 'react'
import { createBlog } from '../../actions/blogs/createBlogAction'

export interface CreateBlogInput {
  title: string,
  image: string,
  description: string,
  author: string,
  authorImage: string
}

export function useCreateBlog() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function create(blog: CreateBlogInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await createBlog(blog)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    create,
    loading,
    error,
    data,
  }
}
