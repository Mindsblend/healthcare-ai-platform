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
  GuestCartItem,
  GuestProductDetail,
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

const GUEST_CART_KEY = 'guest_cart'

export { GUEST_CART_KEY, parseGuestCart }

export function CartProvider({
  children,
  isAuthenticated,
}: {
  children: ReactNode
  isAuthenticated: boolean
}) {
  const value = isAuthenticated
    ? useAuthenticatedCartState()
    : useGuestCartState()

  return <CartContext.Provider value={{ ...value, isAuthenticated }}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }

  return context
}

/* =========================================================
   AUTHENTICATED CART (DB via Prisma)
   ========================================================= */

function useAuthenticatedCartState(): Omit<CartContextValue, 'isAuthenticated'> {
  const [cart, setCart] = useState<CartType | null>(null)
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingAddCount, setPendingAddCount] = useState(0)
  const [pendingMutationCount, setPendingMutationCount] = useState(0)

  const cartRef = useRef<CartType | null>(null)
  const cartRequest = useRef<Promise<CartType | null> | null>(null)
  const createCartRequest = useRef<Promise<CartType> | null>(null)
  const mutationQueue = useRef<Promise<void>>(Promise.resolve())
  const quantityTargets = useRef(new Map<number, number>())
  const quantityWorkers = useRef(new Map<number, Promise<void>>())
  const mutationVersion = useRef(0)
  const completedVersion = useRef(0)
  const pendingMutationPromises = useRef(new Set<Promise<unknown>>())

  const applyCart = useCallback((nextCart: CartType | null) => {
    cartRef.current = nextCart
    setCart(nextCart)
    setCartItems(nextCart?.items ?? [])
    return nextCart
  }, [])

  const fetchCart = useCallback(async () => {
    const activeCart = await getCart()
    return applyCart(activeCart)
  }, [applyCart])

  const loadCartOnce = useCallback(async () => {
    if (!cartRequest.current) {
      cartRequest.current = fetchCart().finally(() => {
        cartRequest.current = null
      })
    }
    return cartRequest.current
  }, [applyCart, fetchCart])

  useEffect(() => {
    setError(null)
    setLoading(true)
    void loadCartOnce()
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load cart')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [applyCart, loadCartOnce])

  const refreshCart = useCallback(async () => {
    try {
      return await fetchCart()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to refresh cart')
      throw err
    }
  }, [fetchCart])

  const getOrCreateCart = useCallback(async (): Promise<CartType> => {
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
  }, [applyCart, loadCartOnce])

  const startMutation = useCallback(() => {
    mutationVersion.current += 1
    setPendingMutationCount((count) => count + 1)
    return mutationVersion.current
  }, [])

  const finishMutation = useCallback((version: number) => {
    completedVersion.current = Math.max(completedVersion.current, version)
    setPendingMutationCount((count) => Math.max(0, count - 1))
  }, [])

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

  const addToCart = useCallback(
    (productId: number, quantity = 1): Promise<void> => {
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

      mutationQueue.current = task.catch(() => undefined)

      const publicTask = task.finally(() => {
        setPendingAddCount((count) => Math.max(0, count - 1))
        finishMutation(version)
      })

      return trackMutationPromise(publicTask)
    },
    [finishMutation, getOrCreateCart, refreshCart, startMutation, trackMutationPromise],
  )

  const updateQuantity = useCallback(
    (cartItemId: number, quantity: number): Promise<void> => {
      if (quantity < 1) {
        return Promise.resolve()
      }

      const version = startMutation()
      quantityTargets.current.set(cartItemId, quantity)

      setCartItems((items) =>
        items.map((item) =>
          item.id === cartItemId ? { ...item, quantity } : item,
        ),
      )

      const existingWorker = quantityWorkers.current.get(cartItemId)
      if (existingWorker) {
        const publicTask = existingWorker.finally(() => {
          finishMutation(version)
        })
        return trackMutationPromise(publicTask)
      }

      const task = mutationQueue.current.then(async () => {
        try {
          while (true) {
            const target = quantityTargets.current.get(cartItemId)
            if (target === undefined) break
            quantityTargets.current.delete(cartItemId)

            const input: UpdateItemQuantityInput = {
              cartItemId,
              quantity: target,
            }
            await updateItemAction(input)

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
          try {
            await refreshCart()
          } catch {
            // Keep original mutation error.
          }
          throw mutationError
        }
      })

      const safeTask = task.catch(() => undefined)
      mutationQueue.current = safeTask

      const workerPromise = task
      quantityWorkers.current.set(cartItemId, workerPromise)

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

  const removeFromCart = useCallback(
    (cartItemId: number): Promise<void> => {
      const version = startMutation()

      const task = mutationQueue.current.then(async () => {
        try {
          const input: RemoveItemInput = { cartItemId }
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

      mutationQueue.current = task.catch(() => undefined)

      const publicTask = task.finally(() => {
        finishMutation(version)
      })

      return trackMutationPromise(publicTask)
    },
    [finishMutation, refreshCart, startMutation, trackMutationPromise],
  )

  const waitForCartSync = useCallback(async () => {
    while (true) {
      const targetVersion = mutationVersion.current
      const pending = Array.from(pendingMutationPromises.current)

      if (pending.length > 0) {
        await Promise.all(pending)
      }

      await mutationQueue.current

      if (completedVersion.current < targetVersion) {
        continue
      }
      if (mutationVersion.current !== targetVersion) {
        continue
      }
      break
    }

    await refreshCart()
  }, [refreshCart])

  return {
    cart,
    cartItems,
    loading,
    error,
    isAdding: pendingAddCount > 0,
    isSyncing: pendingMutationCount > 0,
    addToCart,
    removeFromCart,
    updateQuantity,
    refreshCart,
    waitForCartSync,
  }
}

/* =========================================================
   GUEST CART (localStorage)
   ========================================================= */

function parseGuestCart(): GuestCartItem[] {
  if (typeof localStorage === 'undefined') return []
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item: unknown): item is GuestCartItem =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as GuestCartItem).productId === 'number' &&
        Number.isInteger((item as GuestCartItem).productId) &&
        typeof (item as GuestCartItem).quantity === 'number' &&
        Number.isInteger((item as GuestCartItem).quantity) &&
        (item as GuestCartItem).quantity > 0,
    )
  } catch {
    // Corrupt JSON → purge and start empty
    try {
      localStorage.removeItem(GUEST_CART_KEY)
    } catch {
      // ignore
    }
    return []
  }
}

function saveGuestCart(items: GuestCartItem[]): void {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
  } catch {
    // ignore quota errors
  }
}

async function fetchGuestDetails(
  productIds: number[],
): Promise<GuestProductDetail[]> {
  if (productIds.length === 0) return []
  const res = await fetch('/api/cart/guest-details', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productIds }),
  })
  if (!res.ok) return []
  const data = await res.json()
  return Array.isArray(data?.products) ? data.products : []
}

function buildGuestCartItem(
  item: GuestCartItem,
  details: GuestProductDetail[],
): CartItemType {
  const product = details.find((p) => p.id === item.productId)
  return {
    id: item.productId,
    cartId: 'guest',
    quantity: item.quantity,
    price: product?.price ?? 0,
    product: product
      ? {
          id: product.id,
          title: product.title,
          price: product.price,
          discount: product.discount ?? null,
          discountedPrice: product.discountedPrice ?? null,
          solution: product.solution,
          slug: product.slug,
          image: product.image,
          categoryId: product.categoryId,
          category: product.category,
        }
      : {
          id: item.productId,
          title: 'محصول نامشخص',
          price: 0,
          discount: null,
          discountedPrice: null,
          solution: '',
          slug: '',
          image: '',
          categoryId: 0,
          category: { name: '', iconPath: '' },
        },
  }
}

function useGuestCartState(): Omit<CartContextValue, 'isAuthenticated'> {
  const [rawItems, setRawItems] = useState<GuestCartItem[]>([])
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  // Read localStorage after mount (hydration-safe)
  useEffect(() => {
    const items = parseGuestCart()
    setRawItems(items)
    setLoading(false)
  }, [])

  // Persist to localStorage whenever rawItems changes
  useEffect(() => {
    if (loading) return
    saveGuestCart(rawItems)
  }, [rawItems, loading])

  // Enrich guest items with product details from the API
  useEffect(() => {
    if (loading || rawItems.length === 0) {
      setCartItems([])
      return
    }

    let cancelled = false
    const productIds = rawItems.map((i) => i.productId)

    void fetchGuestDetails(productIds).then((details) => {
      if (cancelled) return
      setCartItems(
        rawItems.map((item) => buildGuestCartItem(item, details)),
      )
    })

    return () => {
      cancelled = true
    }
  }, [rawItems, loading])

  const addToCart = useCallback(
    (productId: number, quantity = 1): Promise<void> => {
      setIsAdding(true)
      setRawItems((prev) => {
        const existing = prev.find((i) => i.productId === productId)
        const next = existing
          ? prev.map((i) =>
              i.productId === productId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            )
          : [...prev, { productId, quantity }]
        return next
      })
      // Brief visual feedback so "در حال افزودن..." shows on the button.
      setTimeout(() => setIsAdding(false), 300)
      return Promise.resolve()
    },
    [],
  )

  const removeFromCart = useCallback(
    (cartItemId: number): Promise<void> => {
      setRawItems((prev) => prev.filter((i) => i.productId !== cartItemId))
      return Promise.resolve()
    },
    [],
  )

  const updateQuantity = useCallback(
    (cartItemId: number, quantity: number): Promise<void> => {
      if (quantity < 1) {
        setRawItems((prev) => prev.filter((i) => i.productId !== cartItemId))
        return Promise.resolve()
      }
      setRawItems((prev) =>
        prev.map((i) =>
          i.productId === cartItemId ? { ...i, quantity } : i,
        ),
      )
      return Promise.resolve()
    },
    [],
  )

  const refreshCart = useCallback(async (): Promise<CartType | null> => {
    // Re-read localStorage to guarantee sync with other tabs
    const items = parseGuestCart()
    setRawItems(items)
    return null
  }, [])

  const waitForCartSync = useCallback(async () => {
    // Guest cart is synchronous (localStorage); nothing to wait for.
    return
  }, [])

  return {
    cart: null,
    cartItems,
    loading,
    error,
    isAdding,
    isSyncing: false,
    addToCart,
    removeFromCart,
    updateQuantity,
    refreshCart,
    waitForCartSync,
  }
}
