import { useState, useEffect } from 'react'
import { getCart } from '../../actions/cart/getCartAction'
import { addItem as addItemAction } from '@/features/shop/actions/cart/addItemAction'
import { removeItem as removeItemAction } from '@/features/shop/actions/cart/removeItemAction'
import { updateItemQuantity as updateItemAction } from '@/features/shop/actions/cart/updateItemAction'
import { createCart } from '../../actions/cart/createCartAction'
import { CartItemType, CartType } from '@/components/types/types'

export function useCart() {
  const [cart, setCart] = useState<CartType | null>(null)
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
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
        if (!activeCart) throw new Error('Failed to create cart')
        setCart(activeCart)
      }

      const updated = await addItemAction(activeCart.id, productId, quantity)
      setCart(updated)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const removeFromCart = async (cartItemId: number) => {
    try {
      await removeItemAction(cartItemId)
      const refreshedCart = await getCart()
      setCart(refreshedCart)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    const updated = await updateItemAction(cartItemId, quantity)
    setCart(updated)
  }

  useEffect(() => {
    setCartItems(cart?.items ?? [])
  }, [cart])

  return {
    cart,
    loading,
    error,
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
  }
}
