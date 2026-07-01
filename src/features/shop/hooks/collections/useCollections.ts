'use client'

import { useEffect, useState } from 'react'
import { getCollectionsAction } from '../../actions/collections/getCollectionsAction'
import { CollectionSummary } from '../../shop.types'

export function useCollections() {
  const [collections, setCollections] = useState<CollectionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getCollectionsAction()
        setCollections(data || []) // Ensure it's always an array
        setError(null) // Clear any previous errors on success
      } catch (err: any) {
        console.error('Failed to load collections:', err)
        setError(err.message)
        setCollections([]) // Set empty array on error
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { collections, loading, error }
}
