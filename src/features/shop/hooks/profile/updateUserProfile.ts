// features/shop/profile/hooks/useUpdateUserProfile.ts

'use client'

import { useState } from 'react'
import { updateUserProfileAction } from '../../actions/profile/updateUserProfileAction'
import {
  UpdateUserProfileInput,
  UpdateUserProfileResponse,
} from '../../shop.types'

export function useUpdateUserProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<UpdateUserProfileResponse | null>(null)

  async function updateUserProfile(input: UpdateUserProfileInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await updateUserProfileAction(input)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { updateUserProfile, loading, error, data }
}
