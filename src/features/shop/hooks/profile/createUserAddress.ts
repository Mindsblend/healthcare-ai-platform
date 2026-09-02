'use client'

import { useState } from 'react'
import { createUserAddressAction } from '../../actions/profile/createUserAddressAction'
import { CreateUserAddressInput } from '../../shop.types'

export function useCreateUserAddress() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<unknown>(null)

  async function createUserAddress(address: CreateUserAddressInput) {
    setLoading(true)
    setError(null)

    try {
      const result = await createUserAddressAction(address)
      setData(result)
      return result
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { createUserAddress, loading, error, data }
}
