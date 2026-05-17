'use client'

import { useEffect, useState } from 'react'
import { getProductsPreview } from '../../actions/products/getProductsPreviewAction'
import { GetProductsByCategoryResponse } from '../../shop.types'

export function useProductsPreview() {
  const [productsPreview, setProductsPreview] = useState<
    GetProductsByCategoryResponse[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProductsPreview()
        setProductsPreview(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { productsPreview, loading, error }
}
