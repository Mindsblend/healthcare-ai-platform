'use client'
import { useState } from 'react'
import { updateUserProfileAction } from '../../actions/profile/updateUserProfileAction'

export function useUpdateUserProfile() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<null>(null)

  async function updateUserProfile(
    data: {
      firstName?: string
      lastName?: string
      email?: string
      phone?: string
    },
  ) {
    setLoading(true)
    setError(null)

    try {
      const result = await updateUserProfileAction(data)
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
