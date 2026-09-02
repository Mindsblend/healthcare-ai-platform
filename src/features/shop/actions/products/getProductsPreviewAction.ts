import { GetProductsPreviewResponse } from '../../shop.types'

export async function getProductsPreview(): Promise<GetProductsPreviewResponse> {
  const res = await fetch('/api/shop/products')
  if (!res.ok) throw new Error('Failed to get products')
  return res.json()
}
