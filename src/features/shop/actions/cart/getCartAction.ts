export async function get() {
  const res = await fetch('/api/cart', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  const data = await res.json()

  if (!res.ok) {
    console.error('[getCart] error object:', data?.error)

    // Throw a real JS Error with the service/domain error code
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return data
}