import { useEffect, useState } from 'react'
import { CartService } from '../../services/CartService'
import { CartType, CartItemType } from '@/components/types/types'

export function useCart() {
  const [cart, setCart] = useState<CartType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        let activeCart = await CartService.fetchActiveCart()

        if (!activeCart) {
          activeCart = await CartService.createCart()
        }

        setCart(activeCart)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // توی hook می‌تونی فانکشن‌هایی برای افزودن، حذف و آپدیت آیتم‌ها هم بسازی

  async function addItem(productId: number, quantity = 1) {
    if (!cart) return
    try {
      await CartService.addItem(cart.id, productId, quantity)
      // دوباره کارت رو بارگذاری کن تا به‌روز بشه
      const updatedCart = await CartService.fetchActiveCart()
      setCart(updatedCart)
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function updateItemQuantity(cartItemId: number, quantity: number) {
    if (!cart) return
    try {
      await CartService.updateItemQuantity(cartItemId, quantity)
      const updatedCart = await CartService.fetchActiveCart()
      setCart(updatedCart)
    } catch (err: any) {
      setError(err.message)
    }
  }

  async function removeItem(cartItemId: number) {
    if (!cart) return
    try {
      await CartService.removeItem(cartItemId)
      const updatedCart = await CartService.fetchActiveCart()
      setCart(updatedCart)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return { cart, loading, error, addItem, updateItemQuantity, removeItem }
}
