// features/shop/cart/hooks/useCart.ts

import { useState, useEffect } from 'react'
import { getCart } from '../../actions/cart/getCartAction'
import { addItem as addItemAction } from '../../actions/cart/addItemAction'
import { removeItem as removeItemAction } from '../../actions/cart/removeItemAction'
import { updateItemQuantity as updateItemAction } from '../../actions/cart/updateItemAction'
import { createCart } from '../../actions/cart/createCartAction'
import {
  CartType,
  CartItemType,
  AddItemInput,
  RemoveItemInput,
  UpdateItemQuantityInput,
} from '../../shop.types'

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

  // Helper to refresh cart data
  const refreshCart = async () => {
    try {
      const refreshedCart = await getCart()
      setCart(refreshedCart)
      return refreshedCart
    } catch (err: any) {
      setError(err.message)
      return null
    }
  }

  // --------------------
  // STRUCTURAL CHANGES
  // --------------------

  const addToCart = async (productId: number, quantity = 1) => {
    try {
      let activeCart = cart

      if (!activeCart) {
        console.warn('[addToCart] No cart yet, creating one...')
        activeCart = await createCart()
        if (!activeCart) throw new Error('Failed to create cart')
        setCart(activeCart)
      }

      const input: AddItemInput = { cartId: activeCart.id, productId, quantity }
      await addItemAction(input)

      // Refresh the entire cart after adding
      await refreshCart()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const removeFromCart = async (cartItemId: number) => {
    try {
      const input: RemoveItemInput = { cartItemId }
      await removeItemAction(input)
      await refreshCart()
    } catch (err: any) {
      setError(err.message)
    }
  }

  // --------------------
  // VALUE-ONLY CHANGES
  // --------------------

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      if (quantity < 1) return

      // Optimistic update: local state first
      setCartItems((items) =>
        items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item,
        ),
      )

      // Send to backend
      const input: UpdateItemQuantityInput = { cartItemId, quantity }
      await updateItemAction(input)

      // Refresh cart to ensure consistency
      await refreshCart()
    } catch (err: any) {
      setError(err.message)
      // Revert optimistic update by refreshing on error
      await refreshCart()
    }
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
