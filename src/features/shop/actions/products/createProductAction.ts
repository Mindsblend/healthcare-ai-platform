import { faqType, gainType, iconType } from '@/components/types/types'

export interface CreateProductInput {
  title: string
  price: number
  slug: string
  solution: string
  image: string
  description: string
  categoryId: number
  feedCategoryId: number
  icons: iconType[]
  gains: gainType[]
  faqs: faqType[]
}

export async function createProductAction(product: CreateProductInput) {
  const res = await fetch('/api/shop/products/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.error('[createProductAction] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return res.json()
}
