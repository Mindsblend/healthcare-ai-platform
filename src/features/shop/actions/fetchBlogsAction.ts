export async function getBlogs() {
  const res = await fetch('/api/shop/blogs')
  if (!res.ok) throw new Error('Failed to fetch blogs')
  return res.json()
}
