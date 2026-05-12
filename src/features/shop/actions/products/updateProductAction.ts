import { ProductDetail } from '@/components/types/types'

export async function updateProductAction(
  productId: number,
  data: {
    title?: string
    price?: number
    slug?: string
    solution?: string
    image?: string
    description?: string
    categoryId?: number
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
  },
): Promise<ProductDetail> {
  const res = await fetch('/api/shop/products/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, ...data }),
  })

  if (!res.ok) {
    const responseData = await res.json()
    throw new Error(responseData?.error || 'Failed to update product')
  }

  return res.json()
}
