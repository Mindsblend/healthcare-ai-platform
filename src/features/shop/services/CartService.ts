// features/shop/cart/services/cartService.ts

import { prisma } from '@/lib/prisma'
import { CartStatus } from '@prisma/client'
import {
  AddItemInput,
  UpdateItemQuantityInput,
  RemoveItemInput,
  ClearCartInput,
  CartType,
} from '../shop.types'

export class CartService {
  // fetch Active Cart
  static async fetchActiveCart(input: {
    userId: string
  }): Promise<CartType | null> {
    const { userId } = input

    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: CartStatus.ACTIVE,
      },
      include: {
        items: {
          orderBy: {
            id: 'asc',
          },
          include: {
            product: {
              include: {
                category: {
                  select: {
                    name: true,
                    iconPath: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!cart) return null

    // Transform to match CartType with ProductSummary
    return {
      id: cart.id,
      userId: cart.userId,
      status: cart.status,
      items: cart.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          solution: item.product.solution,
          slug: item.product.slug,
          image: item.product.image,
          categoryId: item.product.categoryId,
          category: item.product.category, // This matches ProductSummary
        },
      })),
    }
  }

  // Create Cart
  static async createCart(input: { userId: string }): Promise<CartType | null> {
    const { userId } = input

    // First, check if user already has an active cart
    const existingCart = await prisma.cart.findFirst({
      where: {
        userId,
        status: CartStatus.ACTIVE,
      },
      include: {
        items: {
          orderBy: {
            id: 'asc',
          },
          include: {
            product: {
              include: {
                category: {
                  select: {
                    name: true,
                    iconPath: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    // If existing cart found, return it
    if (existingCart) {
      console.log(
        '[CartService.createCart] Found existing cart:',
        existingCart.id,
      )
      return {
        id: existingCart.id,
        userId: existingCart.userId,
        status: existingCart.status,
        items: existingCart.items.map((item) => ({
          id: item.id,
          cartId: item.cartId,
          quantity: item.quantity,
          price: item.price,
          product: {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            solution: item.product.solution,
            slug: item.product.slug,
            image: item.product.image,
            categoryId: item.product.categoryId,
            category: item.product.category,
          },
        })),
      }
    }

    const cart = await prisma.cart.create({
      data: {
        userId,
        status: CartStatus.ACTIVE,
      },
    })

    // Return cart with empty items array (matches CartType)
    return {
      id: cart.id,
      userId: cart.userId,
      status: cart.status,
      items: [],
    }
  }

  /** Add to Cart */
  static async addItem(input: AddItemInput) {
    const { cartId, productId, quantity = 1 } = input

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      throw new Error('Product not found')
    }

    return prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId,
        productId,
        quantity,
        price: product.price,
      },
    })
  }

  /** Change Quantity */
  static async updateItemQuantity(input: UpdateItemQuantityInput) {
    const { cartItemId, quantity } = input

    if (quantity <= 0) {
      return prisma.cartItem.delete({
        where: { id: cartItemId },
      })
    }

    return prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    })
  }

  /** Delete Item */
  static async removeItem(input: RemoveItemInput) {
    const { cartItemId } = input
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    })
  }

  /** Empty Carts */
  static async clearCart(input: ClearCartInput) {
    const { cartId } = input
    return prisma.cartItem.deleteMany({
      where: { cartId },
    })
  }

  /** Total cost */
  static async calculateTotal(input: { cartId: string }) {
    const { cartId } = input
    const items = await prisma.cartItem.findMany({
      where: { cartId },
    })

    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}
