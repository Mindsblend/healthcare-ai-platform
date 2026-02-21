import { faqType, gainType, iconType } from "@/components/types/types"

export async function createProduct(product: {
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
}) {
  const res = await fetch('/api/shop/products/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[createProduct] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}
