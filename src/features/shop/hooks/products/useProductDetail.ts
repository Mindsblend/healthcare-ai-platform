'use client'

import { useEffect, useState } from 'react'
import { getProducts } from '../../actions/products/getProductsAction'
import { ProductDetail } from '@/components/types/types'

export function useProductDetail() {
  const [products, setProducts] = useState<ProductDetail[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { products, loading, error }
}
