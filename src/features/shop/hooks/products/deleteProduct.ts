import { useState } from 'react'
import { deleteProductAction } from '../../actions/products/deleteProductAction'

export function useDeleteProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function deleteProduct(id: number) {
    setLoading(true)
    setError(null)

    try {
      const result = await deleteProductAction(id)
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
    deleteProduct,
    loading,
    error,
    data,
  }
}
