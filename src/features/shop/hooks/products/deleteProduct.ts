import { useState } from 'react'
import { deleteProductAction } from '../../actions/products/deleteProductAction'
import { DeleteProductInput, DeleteProductResponse } from '../../shop.types'

export function useDeleteProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<DeleteProductResponse | null>(null)

  async function deleteProduct(input: DeleteProductInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await deleteProductAction(input)
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
