import { useState, useEffect } from 'react'
import { getCart } from '../../actions/cart/getCartAction'
import { addItem as addItemAction } from '@/features/shop/actions/cart/addItemAction'
import { removeItem as removeItemAction } from '@/features/shop/actions/cart/removeItemAction'
import { updateItemQuantity as updateItemAction } from '@/features/shop/actions/cart/updateItemAction'
import { createCart } from '../../actions/cart/createCartAction'

export function useCart() {
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        let activeCart = await getCart()

        setCart(activeCart)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      let activeCart = cart

      if (!activeCart) {
        console.warn('[addToCart] No cart yet, creating one...')
        activeCart = await createCart()
        setCart(activeCart)
      }

      const updated = await addItemAction(activeCart.id, productId, quantity)
      console.log('[addToCart] Updated cart:', updated)
      setCart(updated)
    } catch (err: any) {
      console.error('[addToCart] Failed:', err)
      setError(err.message)
    }
  }

  const removeFromCart = async (cartItemId: number) => {
    const updated = await removeItemAction(cartItemId)
    setCart(updated)
  }

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    const updated = await updateItemAction(cartItemId, quantity)
    setCart(updated)
  }

  const getItems = () => cart?.items ?? []

  return {
    cart,
    loading,
    error,
    getItems,
    addToCart,
    removeFromCart,
    updateQuantity,
  }
}
