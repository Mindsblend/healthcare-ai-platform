'use client'

import { useState } from 'react'
import { updateCollectionAction } from '../../actions/collections/updateCollectionAction'
import { UpdateCollectionInput, CollectionDetail } from '../../shop.types'

export function useUpdateCollection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function updateCollection(
    input: UpdateCollectionInput,
  ): Promise<CollectionDetail | null> {
    setLoading(true)
    setError(null)

    try {
      const result = await updateCollectionAction(input)
      return result
    } catch (err: any) {
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { updateCollection, loading, error }
}
