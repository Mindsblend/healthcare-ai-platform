'use client'

import { useEffect, useState } from 'react'
import { getProductsByCategory } from '../../actions/products/getProductByCategoryIdAction'
import {
  GetProductsByCategoryInput,
  GetProductsByCategoryResponse,
} from '../../shop.types'

export function useProductsByCategoryId(input: GetProductsByCategoryInput) {
  const [productsByCategoryId, setProductsByCategoryId] = useState<
    GetProductsByCategoryResponse[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!input.categoryId) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProductsByCategory(input)
        setProductsByCategoryId(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [input.categoryId])

  return { productsByCategoryId, loading, error }
}
