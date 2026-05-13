'use client'
import { useState } from 'react'
import { updateProductAction } from '../../actions/products/updateProductAction'
import { ProductDetail } from '@/components/types/types'

interface UpdateProductData {
  title?: string
  price?: number
  slug?: string
  solution?: string
  image?: string
  description?: string
  categoryId?: number
  feedCategoryId?: number
  isActive?: boolean
  icons?: Array<{
    title: string
    description: string
    iconPath?: string | null
  }>
  gains?: Array<{
    title: string
    description: string
    ingredient?: string
  }>
  faqs?: Array<{
    question: string
    answer: string
  }>
}

export function useUpdateProduct() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<ProductDetail | null>(null)

  async function updateProduct(
    productId: number,
    productData: UpdateProductData,
  ) {
    setLoading(true)
    setError(null)

    try {
      const result = await updateProductAction(productId, productData)
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
