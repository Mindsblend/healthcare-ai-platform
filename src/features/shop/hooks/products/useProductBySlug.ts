'use client'

import { useEffect, useState } from 'react'
import { getProductBySlug } from '../../actions/products/getProductBySlugAction'
import {
  GetProductBySlugInput,
  GetProductBySlugResponse,
} from '../../shop.types'

export function useProductBySlug(input: GetProductBySlugInput) {
  const [product, setProduct] = useState<GetProductBySlugResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!input.slug) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProductBySlug(input)
        setProduct(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [input.slug])

  return { product, loading, error }
}
