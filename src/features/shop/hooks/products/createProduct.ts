'use client'

import { useState } from 'react'
import { createProductAction, CreateProductInput } from '../../actions/products/createProductAction'

export function useCreateProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function create(product: CreateProductInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await createProductAction(product)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error, data }
}