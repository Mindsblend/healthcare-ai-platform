import { useState } from 'react'
import { deleteBlogAction } from '../../actions/blogs/deleteBlogAction'

export function useDeleteBlog() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function deleteBlog(id: number) {
    setLoading(true)
    setError(null)

    try {
      const result = await deleteBlogAction(id)
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
