'use client'

import { useEffect, useState } from 'react'
import { getBlogs } from '../../actions/blogs/getBlogsAction'
import { BlogType } from '@/components/types/types'

export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getBlogs()
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
