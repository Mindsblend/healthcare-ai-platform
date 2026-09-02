// features/shop/orders/actions/getOrderById.ts

import { GetOrderByIdInput, GetOrderByIdResponse } from '../../shop.types'

export async function getOrderById(
  input: GetOrderByIdInput,
): Promise<GetOrderByIdResponse> {
  const { id } = input
  const res = await fetch(`/api/shop/orders/${encodeURIComponent(id)}`)

  if (!res.ok) throw new Error('Failed to get order')

  return res.json()
}
