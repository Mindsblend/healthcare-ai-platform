'use client'

import { useEffect, useState } from 'react'
import { getProductBySlug } from '../../actions/products/getProductBySlugAction'
import { ProductDetail } from '@/components/types/types'

export function useProductBySlug(slug: string) {
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProductBySlug(slug)
        setProduct(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  return { product, loading, error, getProductBySlug }
}
