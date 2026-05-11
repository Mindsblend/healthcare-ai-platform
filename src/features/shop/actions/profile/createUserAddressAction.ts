export interface CreateUserAddressInput {
  firstName: string
  lastName: string
  city: string
  province: string
  email: string
  phone: string
  address: string
  postalCode: string
}

export async function createUserAddressAction(address: CreateUserAddressInput) {
  const res = await fetch('/api/shop/profile/pages/address/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(address),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.error('[createUserAddressAction] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return res.json()
}
