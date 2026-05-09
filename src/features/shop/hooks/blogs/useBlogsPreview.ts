'use client'

import { useEffect, useState } from 'react'
import { getBlogsPreview } from '../../actions/blogs/getBlogsPreviewAction'
import { BlogType } from '@/components/types/types'

export function useBlogsPreview() {
  const [blogs, setBlogs] = useState<BlogType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogsPreview()
        setBlogs(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { blogs, loading, error }
}
