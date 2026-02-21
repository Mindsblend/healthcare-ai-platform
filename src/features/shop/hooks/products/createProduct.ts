import { useState } from 'react'
import { createProduct } from '../../actions/products/createProductAction'
import { iconType, gainType, faqType } from '@/components/types/types'

export interface CreateProductInput {
  title: string
  price: number
  slug: string
  solution: string
  image: string
  description: string
  categoryId: number
  icons: iconType[]
  gains: gainType[]
  faqs: faqType[]
}

export function useCreateProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function create(product: CreateProductInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await createProduct(product)
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
    create,
    loading,
    error,
    data,
  }
}
