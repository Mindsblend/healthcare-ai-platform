// features/shop/cart/hooks/useCart.ts

import { useState, useEffect, useRef } from 'react'
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

  // Add refs to prevent race conditions
  const creatingCart = useRef(false)
  const cartPromise = useRef<Promise<CartType> | null>(null)
  const addQueue = useRef<Array<{ productId: number; quantity: number }>>([])
  const isProcessingAdds = useRef(false)

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
      setCartItems(refreshedCart?.items ?? [])
      return refreshedCart
    } catch (err: any) {
      setError(err.message)
      return null
    }
  }

  // Get or create cart - ensures only ONE cart exists
  const getOrCreateCart = async (): Promise<CartType> => {
    // If we already have a cart in state, use it
    if (cart) {
      return cart
    }

    // If cart creation is already in progress, wait for it
    if (creatingCart.current && cartPromise.current) {
      console.log('[getOrCreateCart] Waiting for existing cart creation...')
      return await cartPromise.current
    }

    // Check server for existing cart (in case state is stale)
    console.log('[getOrCreateCart] Checking for existing cart...')
    const existingCart = await getCart()
    if (existingCart) {
      console.log('[getOrCreateCart] Found existing cart:', existingCart.id)
      setCart(existingCart)
      return existingCart
    }

    // Create new cart
    console.log('[getOrCreateCart] Creating new cart...')
    creatingCart.current = true
    cartPromise.current = createCart()

    try {
      const newCart = await cartPromise.current
      if (!newCart) throw new Error('Failed to create cart')
      console.log('[getOrCreateCart] Created cart:', newCart.id)
      setCart(newCart)
      return newCart
    } finally {
      creatingCart.current = false
      cartPromise.current = null
    }
  }

  // Process queued adds
  const processAddQueue = async () => {
    if (isProcessingAdds.current || addQueue.current.length === 0) return

    isProcessingAdds.current = true

    try {
      // Get or create cart once for all queued items
      const activeCart = await getOrCreateCart()

      // Process all queued adds
      while (addQueue.current.length > 0) {
        const add = addQueue.current.shift()
        if (!add) continue

        console.log(
          '[processAddQueue] Adding product:',
          add.productId,
          'to cart:',
          activeCart.id,
        )

        const input: AddItemInput = {
          cartId: activeCart.id,
          productId: add.productId,
          quantity: add.quantity,
        }
        await addItemAction(input)
      }

      // Single refresh after all adds are done
      await refreshCart()
    } catch (err: any) {
      console.error('[processAddQueue] Error:', err)
      setError(err.message)
    } finally {
      isProcessingAdds.current = false
    }
  }

  const addToCart = async (productId: number, quantity = 1) => {
    // Add to queue
    addQueue.current.push({ productId, quantity })

    // Start processing queue
    await processAddQueue()
  }

  const removeFromCart = async (cartItemId: number) => {
    try {
      setLoading(true)
      const input: RemoveItemInput = { cartItemId }
      await removeItemAction(input)
      await refreshCart()
    } catch (err: any) {
      console.error('[removeFromCart] Error:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return

    try {
      setLoading(true)

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
      console.error('[updateQuantity] Error:', err)
      setError(err.message)
      // Revert optimistic update by refreshing on error
      await refreshCart()
    } finally {
      setLoading(false)
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
    refreshCart,
  }
}
