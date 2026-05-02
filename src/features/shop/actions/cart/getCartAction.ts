export async function getCart() {
  const res = await fetch('/api/shop/cart', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  const data = await res.json()

  if (!res.ok) {
    console.log('[getCart] error object:', data?.error)

    // Throw a real JS Error with the service/domain error code
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}
