'use client'

import { useState } from 'react'
import { updateProductAction } from '../../actions/products/updateProductAction'
import { UpdateProductInput, UpdateProductResponse } from '../../shop.types'

export function useUpdateProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<UpdateProductResponse | null>(null)

  async function updateProduct(input: UpdateProductInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await updateProductAction(input)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateProduct, loading, error, data }
}
