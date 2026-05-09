'use client'

import { useEffect, useState } from 'react'
import { getProductsByCategory } from '../../actions/products/getProductByCategoryIdAction'

export function useProductsByCategoryId(categoryId: number) {
  const [productsByCategoryId, setProductsByCategoryId] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!categoryId) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProductsByCategory(categoryId)
        setProductsByCategoryId(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [categoryId])

  return { productsByCategoryId, loading, error }
}
