'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
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

type CartContextValue = {
  cart: CartType | null
  cartItems: CartItemType[]
  loading: boolean
  error: string | null
  isAdding: boolean
  isAuthenticated: boolean
  addToCart: (productId: number, quantity?: number) => Promise<void>
  removeFromCart: (cartItemId: number) => Promise<void>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>
  refreshCart: () => Promise<CartType | null>
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({
  children,
  isAuthenticated,
}: {
  children: ReactNode
  isAuthenticated: boolean
}) {
  const value = useCartState(isAuthenticated)

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}

function useCartState(isAuthenticated: boolean): CartContextValue {
  const [cart, setCart] = useState<CartType | null>(null)
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(isAuthenticated)
  const [error, setError] = useState<string | null>(null)
  const [pendingAddCount, setPendingAddCount] = useState(0)

  // Refs keep asynchronous operations in sync even before React has rendered
  // the state update. One provider means product cards no longer create
  // competing carts or repeat the same initial requests.
  const cartRef = useRef<CartType | null>(null)
  const cartRequest = useRef<Promise<CartType | null> | null>(null)
  const createCartRequest = useRef<Promise<CartType> | null>(null)
  const addQueue = useRef<Promise<void>>(Promise.resolve())

  const applyCart = useCallback((nextCart: CartType | null) => {
    cartRef.current = nextCart
    setCart(nextCart)
    setCartItems(nextCart?.items ?? [])
    return nextCart
  }, [])

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      return applyCart(null)
    }

    const activeCart = await getCart()
    return applyCart(activeCart)
  }, [applyCart, isAuthenticated])

  const loadCartOnce = useCallback(async () => {
    if (!isAuthenticated) return applyCart(null)

    if (!cartRequest.current) {
      cartRequest.current = fetchCart().finally(() => {
        cartRequest.current = null
      })
    }

    return cartRequest.current
  }, [applyCart, fetchCart, isAuthenticated])

  useEffect(() => {
    setError(null)

    if (!isAuthenticated) {
      setLoading(false)
      applyCart(null)
      return
    }

    setLoading(true)
    void loadCartOnce()
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load cart')
      })
      .finally(() => setLoading(false))
  }, [applyCart, isAuthenticated, loadCartOnce])

  const refreshCart = useCallback(async () => {
    try {
      return await fetchCart()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to refresh cart')
      throw err
    }
  }, [fetchCart])

  const getOrCreateCart = useCallback(async (): Promise<CartType> => {
    if (!isAuthenticated) {
      throw new Error('AUTH_REQUIRED')
    }

    if (cartRef.current) return cartRef.current

    const existingCart = await loadCartOnce()
    if (existingCart) return existingCart

    if (!createCartRequest.current) {
      createCartRequest.current = createCart()
        .then((newCart) => applyCart(newCart))
        .finally(() => {
          createCartRequest.current = null
        })
    }

    return createCartRequest.current
  }, [applyCart, isAuthenticated, loadCartOnce])

  const addToCart = useCallback(
    (productId: number, quantity = 1) => {
      if (!isAuthenticated) {
        return Promise.reject(new Error('AUTH_REQUIRED'))
      }

      setPendingAddCount((count) => count + 1)

      const task = addQueue.current.then(async () => {
        try {
          const activeCart = await getOrCreateCart()
          const input: AddItemInput = {
            cartId: activeCart.id,
            productId,
            quantity,
          }

          await addItemAction(input)
          await refreshCart()
          setError(null)
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Failed to add item'
          setError(message)
          throw err
        }
      })

      // A failed add should be reported to its caller, but must not prevent
      // a later click from being processed.
      addQueue.current = task.catch(() => undefined)

      return task.finally(() => {
        setPendingAddCount((count) => Math.max(0, count - 1))
      })
    },
    [getOrCreateCart, isAuthenticated, refreshCart],
  )

  const removeFromCart = useCallback(
    async (cartItemId: number) => {
      try {
        const input: RemoveItemInput = { cartItemId }
        await removeItemAction(input)
        await refreshCart()
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to remove item'
        setError(message)
        throw err
      }
    },
    [refreshCart],
  )

  const updateQuantity = useCallback(
    async (cartItemId: number, quantity: number) => {
      if (quantity < 1) return

      const previousItems = cartItems
      setCartItems((items) =>
        items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item,
        ),
      )

      try {
        const input: UpdateItemQuantityInput = { cartItemId, quantity }
        await updateItemAction(input)
        await refreshCart()
      } catch (err: unknown) {
        setCartItems(previousItems)
        const message =
          err instanceof Error ? err.message : 'Failed to update quantity'
        setError(message)
        throw err
      }
    },
    [cartItems, refreshCart],
  )

  return {
    cart,
    cartItems,
    loading,
    error,
    isAdding: pendingAddCount > 0,
    isAuthenticated,
    addToCart,
    removeFromCart,
    updateQuantity,
    refreshCart,
  }
}
