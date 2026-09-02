// features/shop/hooks/collections/useCollectionBySlug.ts
'use client'

import { useEffect, useState } from 'react'
import { getCollectionBySlugAction } from '../../actions/collections/getCollectionBySlugAction'
import { CollectionDetail } from '../../shop.types'

export function useCollectionBySlug(slug: string) {
  const [collection, setCollection] = useState<CollectionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    let isMounted = true

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const data = await getCollectionBySlugAction(slug)
        if (isMounted) {
          setCollection(data)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message)
          setCollection(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [slug]) // slug is the dependency

  return { collection, loading, error }
}
