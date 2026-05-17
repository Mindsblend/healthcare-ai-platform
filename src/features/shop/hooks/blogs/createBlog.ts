// features/shop/blogs/hooks/useCreateBlog.ts

import { useState } from 'react'
import { createBlog } from '../../actions/blogs/createBlogAction'
import { CreateBlogInput, CreateBlogResponse } from '../../shop.types'

export function useCreateBlog() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<CreateBlogResponse | null>(null)

  async function create(input: CreateBlogInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await createBlog(input)
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
