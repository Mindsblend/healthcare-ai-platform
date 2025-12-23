export async function createCart() {
  const res = await fetch('/api/shop/cart/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[createCart] error object:', data?.error)

    // Throw a real JS Error with the service/domain error code
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}
