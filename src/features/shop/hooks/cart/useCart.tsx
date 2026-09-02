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
  isSyncing: boolean
  isAuthenticated: boolean

  addToCart: (productId: number, quantity?: number) => Promise<void>

  removeFromCart: (cartItemId: number) => Promise<void>

  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>

  refreshCart: () => Promise<CartType | null>

  waitForCartSync: () => Promise<void>
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

  const [pendingMutationCount, setPendingMutationCount] = useState(0)

  // =========================================================
  // Refs
  // =========================================================

  const cartRef = useRef<CartType | null>(null)

  const cartRequest = useRef<Promise<CartType | null> | null>(null)

  const createCartRequest = useRef<Promise<CartType> | null>(null)

  /**
   * All mutations are serialized:
   *
   * ADD
   * UPDATE
   * REMOVE
   *
   * cannot hit the backend simultaneously.
   */
  const mutationQueue = useRef<Promise<void>>(Promise.resolve())

  /**
   * Latest desired quantity for every cart item.
   *
   * Example:
   *
   * 1 → 2 → 3 → 4 → 5
   *
   * backend ultimately receives:
   *
   * 5
   */
  const quantityTargets = useRef(new Map<number, number>())

  /**
   * Tracks active update worker for each cart item.
   */
  const quantityWorkers = useRef(new Map<number, Promise<void>>())

  /**
   * Every mutation receives a version.
   */
  const mutationVersion = useRef(0)
  const completedVersion = useRef(0)

  /**
   * IMPORTANT:
   *
   * Unlike mutationQueue, these promises preserve
   * the real mutation result/rejection.
   *
   * waitForCartSync() uses this collection so
   * a failed mutation cannot be silently swallowed.
   */
  const pendingMutationPromises = useRef(new Set<Promise<unknown>>())

  // =========================================================
  // Cart state helpers
  // =========================================================

  const applyCart = useCallback((nextCart: CartType | null) => {
    cartRef.current = nextCart

    setCart(nextCart)
    setCartItems(nextCart?.items ?? [])

    return nextCart
  }, [])

  // =========================================================
  // Fetch cart
  // =========================================================

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      return applyCart(null)
    }

    const activeCart = await getCart()

    return applyCart(activeCart)
  }, [applyCart, isAuthenticated])

  const loadCartOnce = useCallback(async () => {
    if (!isAuthenticated) {
      return applyCart(null)
    }

    if (!cartRequest.current) {
      cartRequest.current = fetchCart().finally(() => {
        cartRequest.current = null
      })
    }

    return cartRequest.current
  }, [applyCart, fetchCart, isAuthenticated])

  // =========================================================
  // Initial cart load
  // =========================================================

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
      .finally(() => {
        setLoading(false)
      })
  }, [applyCart, isAuthenticated, loadCartOnce])

  // =========================================================
  // Refresh cart
  // =========================================================

  const refreshCart = useCallback(async () => {
    try {
      return await fetchCart()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to refresh cart')

      throw err
    }
  }, [fetchCart])

  // =========================================================
  // Get / Create Cart
  // =========================================================

  const getOrCreateCart = useCallback(async (): Promise<CartType> => {
    if (!isAuthenticated) {
      throw new Error('AUTH_REQUIRED')
    }

    if (cartRef.current) {
      return cartRef.current
    }

    const existingCart = await loadCartOnce()

    if (existingCart) {
      return existingCart
    }

    if (!createCartRequest.current) {
      createCartRequest.current = createCart()
        .then((newCart) => {
          applyCart(newCart)
          return newCart
        })
        .finally(() => {
          createCartRequest.current = null
        })
    }

    return createCartRequest.current
  }, [applyCart, isAuthenticated, loadCartOnce])

  // =========================================================
  // Mutation helpers
  // =========================================================

  const startMutation = useCallback(() => {
    mutationVersion.current += 1

    setPendingMutationCount((count) => count + 1)

    return mutationVersion.current
  }, [])

  const finishMutation = useCallback((version: number) => {
    completedVersion.current = Math.max(completedVersion.current, version)

    setPendingMutationCount((count) => Math.max(0, count - 1))
  }, [])

  /**
   * Add a mutation promise to the set and automatically
   * remove it when it settles.
   */
  const trackMutationPromise = useCallback(<T,>(promise: Promise<T>) => {
    pendingMutationPromises.current.add(promise)

    promise.then(
      () => {
        pendingMutationPromises.current.delete(promise)
      },
      () => {
        pendingMutationPromises.current.delete(promise)
      },
    )

    return promise
  }, [])

  // =========================================================
  // ADD TO CART
  // =========================================================

  const addToCart = useCallback(
    (productId: number, quantity = 1): Promise<void> => {
      if (!isAuthenticated) {
        return Promise.reject(new Error('AUTH_REQUIRED'))
      }

      const version = startMutation()

      setPendingAddCount((count) => count + 1)

      const task = mutationQueue.current.then(async () => {
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
          const message =
            err instanceof Error ? err.message : 'Failed to add item'

          setError(message)

          throw err
        }
      })

      /**
       * Queue continues even when current mutation fails.
       */
      mutationQueue.current = task.catch(() => undefined)

      const publicTask = task.finally(() => {
        setPendingAddCount((count) => Math.max(0, count - 1))

        finishMutation(version)
      })

      return trackMutationPromise(publicTask)
    },
    [
      finishMutation,
      getOrCreateCart,
      isAuthenticated,
      refreshCart,
      startMutation,
      trackMutationPromise,
    ],
  )

  // =========================================================
  // UPDATE QUANTITY
  // =========================================================

  const updateQuantity = useCallback(
    (cartItemId: number, quantity: number): Promise<void> => {
      if (quantity < 1) {
        return Promise.resolve()
      }

      const version = startMutation()

      /**
       * Latest desired quantity.
       */
      quantityTargets.current.set(cartItemId, quantity)

      /**
       * Optimistic UI.
       */
      setCartItems((items) =>
        items.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity,
              }
            : item,
        ),
      )

      /**
       * Existing worker for this item:
       * return it instead of creating another worker.
       */
      const existingWorker = quantityWorkers.current.get(cartItemId)

      if (existingWorker) {
        const publicTask = existingWorker.finally(() => {
          finishMutation(version)
        })

        return trackMutationPromise(publicTask)
      }

      /**
       * Create worker.
       */
      const task = mutationQueue.current.then(async () => {
        try {
          while (true) {
            const target = quantityTargets.current.get(cartItemId)

            if (target === undefined) {
              break
            }

            /**
             * Consume target.
             */
            quantityTargets.current.delete(cartItemId)

            const input: UpdateItemQuantityInput = {
              cartItemId,
              quantity: target,
            }

            await updateItemAction(input)

            /**
             * Another quantity was requested
             * while the request was in progress.
             */
            if (quantityTargets.current.has(cartItemId)) {
              continue
            }

            break
          }

          setError(null)
        } catch (err: unknown) {
          const mutationError =
            err instanceof Error ? err : new Error('Failed to update quantity')

          setError(mutationError.message)

          /**
           * Restore real backend state.
           */
          try {
            await refreshCart()
          } catch {
            // Keep original mutation error.
          }

          throw mutationError
        }
      })

      /**
       * Keep queue alive after failure.
       */
      const safeTask = task.catch(() => undefined)

      mutationQueue.current = safeTask

      /**
       * Track worker promise that preserves
       * the actual rejection.
       */
      const workerPromise = task

      quantityWorkers.current.set(cartItemId, workerPromise)

      /**
       * Cleanup worker map.
       */
      workerPromise.then(
        () => {
          if (quantityWorkers.current.get(cartItemId) === workerPromise) {
            quantityWorkers.current.delete(cartItemId)
          }
        },
        () => {
          if (quantityWorkers.current.get(cartItemId) === workerPromise) {
            quantityWorkers.current.delete(cartItemId)
          }
        },
      )

      const publicTask = workerPromise.finally(() => {
        finishMutation(version)
      })

      return trackMutationPromise(publicTask)
    },
    [finishMutation, refreshCart, startMutation, trackMutationPromise],
  )

  // =========================================================
  // REMOVE FROM CART
  // =========================================================

  const removeFromCart = useCallback(
    (cartItemId: number): Promise<void> => {
      const version = startMutation()

      const task = mutationQueue.current.then(async () => {
        try {
          const input: RemoveItemInput = {
            cartItemId,
          }

          await removeItemAction(input)

          await refreshCart()

          setError(null)
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : 'Failed to remove item'

          setError(message)

          throw err
        }
      })

      /**
       * Keep queue usable after failure.
       */
      mutationQueue.current = task.catch(() => undefined)

      const publicTask = task.finally(() => {
        finishMutation(version)
      })

      return trackMutationPromise(publicTask)
    },
    [finishMutation, refreshCart, startMutation, trackMutationPromise],
  )

  // =========================================================
  // WAIT FOR CART SYNC
  // =========================================================

  const waitForCartSync = useCallback(async () => {
    while (true) {
      const targetVersion = mutationVersion.current

      /**
       * Snapshot current pending mutations.
       *
       * These promises preserve rejection.
       */
      const pending = Array.from(pendingMutationPromises.current)

      if (pending.length > 0) {
        /**
         * If ANY mutation failed, checkout must stop.
         */
        await Promise.all(pending)
      }

      /**
       * Wait for queue as a final guarantee.
       */
      await mutationQueue.current

      /**
       * If a mutation happened while we were
       * waiting, loop again.
       */
      if (completedVersion.current < targetVersion) {
        continue
      }

      if (mutationVersion.current !== targetVersion) {
        continue
      }

      break
    }

    /**
     * Final single server refresh.
     */
    await refreshCart()
  }, [refreshCart])

  // =========================================================
  // Return
  // =========================================================

  return {
    cart,
    cartItems,

    loading,
    error,

    isAdding: pendingAddCount > 0,

    isSyncing: pendingMutationCount > 0,

    isAuthenticated,

    addToCart,
    removeFromCart,
    updateQuantity,

    refreshCart,
    waitForCartSync,
  }
}
