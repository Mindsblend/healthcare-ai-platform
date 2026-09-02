// features/shop/blogs/hooks/useDeleteBlog.ts

import { useState } from 'react'
import { deleteBlogAction } from '../../actions/blogs/deleteBlogAction'
import { DeleteBlogInput, DeleteBlogResponse } from '../../shop.types'

export function useDeleteBlog() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<DeleteBlogResponse | null>(null)

  async function deleteBlog(input: DeleteBlogInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await deleteBlogAction(input)
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
    deleteBlog,
    loading,
    error,
    data,
  }
}
