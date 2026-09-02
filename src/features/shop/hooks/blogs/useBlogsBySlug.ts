'use client'

import { useEffect, useState } from 'react'
import { getBlogBySlug } from '../../actions/blogs/getBlogBySlugAction'
import { GetBlogBySlugInput, GetBlogBySlugResponse } from '../../shop.types'

export function useBlogBySlug(input: GetBlogBySlugInput) {
  const [blog, setBlog] = useState<GetBlogBySlugResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!input.slug) {
      setLoading(false)
      return
    }

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getBlogBySlug(input)
        setBlog(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [input.slug])

  return { blog, loading, error }
}
