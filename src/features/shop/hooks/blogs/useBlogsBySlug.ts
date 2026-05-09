'use client'

import { useEffect, useState } from 'react'
import { getBlogBySlug } from '../../actions/blogs/getBlogBySlugAction'
import { BlogDetail } from '@/components/types/types'

export function useBlogBySlug(slug: string) {
  const [blog, setBlog] = useState<BlogDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getBlogBySlug(slug)
        setBlog(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  return { blog, loading, error, getBlogBySlug }
}
