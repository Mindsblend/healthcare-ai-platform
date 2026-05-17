import { DeleteBlogInput, DeleteBlogResponse } from '../../shop.types'

export async function deleteBlogAction(
  input: DeleteBlogInput,
): Promise<DeleteBlogResponse> {
  const res = await fetch('/api/shop/blogs/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => null)
    console.error('[deleteBlogAction] error object:', data?.error)
    throw new Error(data?.error?.code || 'UNKNOWN')
  }

  return res.json()
}
