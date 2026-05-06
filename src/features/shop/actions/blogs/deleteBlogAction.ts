export async function deleteBlogAction(id: number) {
  const res = await fetch('/api/shop/blogs/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(id),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.error('[deleteBlogAction] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return res.json()
}
