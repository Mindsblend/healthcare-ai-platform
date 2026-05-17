import {
  GetProductBySlugInput,
  GetProductBySlugResponse,
} from '../../shop.types'

export async function getProductBySlug(
  input: GetProductBySlugInput,
): Promise<GetProductBySlugResponse> {
  const { slug } = input
  const res = await fetch(`/api/shop/products/${encodeURIComponent(slug)}`)

  if (!res.ok) throw new Error('Failed to get product')

  return res.json()
}
