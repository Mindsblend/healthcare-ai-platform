'use client'

import { useEffect, useState } from 'react'
import { getUserAddress } from '../../actions/profile/getUserAddressAction'
import { UserAddress } from '../../shop.types'

export function useUserAddress() {
  const [userAddress, setUserAddress] = useState<UserAddress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getUserAddress()
        setUserAddress(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return { userAddress, loading, error }
}
