import {
  GetProductsByCategoryInput,
  GetProductsByCategoryResponse,
} from '../../shop.types'

export async function getProductsByCategory(
  input: GetProductsByCategoryInput,
): Promise<GetProductsByCategoryResponse[]> {
  const { categoryId } = input
  const res = await fetch(`/api/shop/products?categoryId=${categoryId}`)

  if (!res.ok) throw new Error('Failed to get products by category')

  return res.json()
}
