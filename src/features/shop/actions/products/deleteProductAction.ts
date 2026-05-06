export async function deleteProductAction(id: number) {
  const res = await fetch('/api/shop/products/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(id),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.error('[deleteProductAction] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return res.json()
}
