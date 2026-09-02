import {
  CreateUserAddressInput,
  CreateUserAddressResponse,
} from '../../shop.types'

export async function createUserAddressAction(
  input: CreateUserAddressInput,
): Promise<CreateUserAddressResponse> {
  const res = await fetch('/api/shop/profile/pages/address/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.error('[createUserAddressAction] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return res.json()
}
