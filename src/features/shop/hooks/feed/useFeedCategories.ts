'use client'

import { useEffect, useState } from 'react'
import { getFeedCategories } from '../../actions/feed/getFeedCategoriesAction'
import { FeedCategoryWithProducts } from '@/components/types/types'

export function useFeedCategories() {
  const [feedCategories, setFeedCategories] = useState<
    FeedCategoryWithProducts[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getFeedCategories()
        setFeedCategories(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { feedCategories, loading, error }
}
