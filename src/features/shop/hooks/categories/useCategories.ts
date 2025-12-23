'use client'

import { useEffect, useState } from 'react'
import { getCategories } from '../../actions/categories/getCategoriesAction'
import { CategoryType } from '@/components/types/types'

export function useCategories() {
  const [categories, setcategories] = useState<CategoryType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getCategories()
        setcategories(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { categories, loading, error }
}
