'use client'

import { useState } from 'react'
import { deleteCollectionAction } from '../../actions/collections/deleteCollectionAction'
import {
  DeleteCollectionInput,
  DeleteCollectionResponse,
} from '../../shop.types'

export function useDeleteCollection() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  async function deleteCollection(
    input: DeleteCollectionInput,
  ): Promise<DeleteCollectionResponse | null> {
    setLoading(true)
    setError(null)

    try {
      const result = await deleteCollectionAction(input)
      return result
    } catch (err: any) {
      setError(err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { deleteCollection, loading, error }
}
