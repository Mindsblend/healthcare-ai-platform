'use client'

import { useState } from 'react'
import { createCollectionAction } from '../../actions/collections/createCollectionAction'
import { CreateCollectionInput, CollectionDetail } from '../../shop.types'

export function useCreateCollection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function createCollection(
    input: CreateCollectionInput,
  ): Promise<CollectionDetail | null> {
    setLoading(true)
    setError(null)

    try {
      const result = await createCollectionAction(input)
      return result
    } catch (err: any) {
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { createCollection, loading, error }
}
