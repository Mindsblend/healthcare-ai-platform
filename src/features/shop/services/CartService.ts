// features/shop/cart/services/cartService.ts

import { prisma } from '@/lib/prisma'
import {
  AddItemInput,
  UpdateItemQuantityInput,
  RemoveItemInput,
  ClearCartInput,
  CartType,
} from '../shop.types'

const CART_STATUS = {
  ACTIVE: 'ACTIVE',
  CHECKED_OUT: 'CHECKED_OUT',
  ABANDONED: 'ABANDONED',
  CONVERTED: 'CONVERTED',
} as const

export class CartService {
  // fetch Active Cart
  static async fetchActiveCart(input: {
    userId: string
  }): Promise<CartType | null> {
    const { userId } = input

    const cart = await prisma.cart.findFirst({
      where: {
        userId,
        status: CART_STATUS.ACTIVE,
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
      items: cart.items.map((item: any) => ({
        id: item.id,
        cartId: item.cartId,
        quantity: item.quantity,
        price: item.price,
        product: {
          id: item.product.id,
          title: item.product.title,
          price: item.product.price,
          discount: item.product.discount,
          discountedPrice: item.product.discountedPrice,
          solution: item.product.solution,
          slug: item.product.slug,
          image: item.product.image,
          categoryId: item.product.categoryId,
          category: item.product.category,
        },
      })),
    }
  }

  // Create Cart
  static async createCart(input: { userId: string }): Promise<CartType | null> {
    const { userId } = input

    const existingCart = await prisma.cart.findFirst({
      where: {
        userId,
        status: CART_STATUS.ACTIVE,
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

    if (existingCart) {
      return {
        id: existingCart.id,
        userId: existingCart.userId,
        status: existingCart.status,
        items: existingCart.items.map((item: any) => ({
          id: item.id,
          cartId: item.cartId,
          quantity: item.quantity,
          price: item.price,
          product: {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            discount: item.product.discount,
            discountedPrice: item.product.discountedPrice,
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
        status: CART_STATUS.ACTIVE,
      },
    })

    return {
      id: cart.id,
      userId: cart.userId,
      status: cart.status,
      items: [],
    }
  }

  /** Add to Cart */
  static async addItem(input: AddItemInput, userId: string) {
    const { cartId, productId, quantity = 1 } = input

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error('Quantity must be a positive integer')
    }

    return prisma.$transaction(async (tx) => {
      const cart = await tx.cart.findFirst({
        where: {
          id: cartId,
          userId,
          status: CART_STATUS.ACTIVE,
        },
        select: { id: true },
      })

      if (!cart) {
        throw new Error('Active cart not found')
      }

      const product = await tx.product.findFirst({
        where: { id: productId, isActive: true },
        select: { price: true },
      })

      if (!product) {
        throw new Error('Product not found')
      }

      return tx.cartItem.upsert({
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
    })
  }

  /** Change Quantity */
  static async updateItemQuantity(
    input: UpdateItemQuantityInput,
    userId: string,
  ) {
    const { cartItemId, quantity } = input

    if (!Number.isInteger(quantity)) {
      throw new Error('Quantity must be an integer')
    }

    const item = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId,
        },
      },
      select: {
        id: true,
      },
    })

    if (!item) {
      throw new Error('Cart item not found')
    }

    if (quantity <= 0) {
      return prisma.cartItem.delete({
        where: { id: item.id },
      })
    }

    return prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    })
  }

  /** Delete Item */
  static async removeItem(input: RemoveItemInput, userId: string) {
    const { cartItemId } = input

    const item = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        cart: {
          userId,
        },
      },
      select: {
        id: true,
      },
    })

    if (!item) {
      throw new Error('Cart item not found')
    }

    return prisma.cartItem.delete({
      where: { id: item.id },
    })
  }

  /** Empty Carts */
  static async clearCart(input: ClearCartInput, userId: string) {
    const { cartId } = input

    const cart = await prisma.cart.findFirst({
      where: {
        id: cartId,
        userId,
      },
      select: {
        id: true,
      },
    })

    if (!cart) {
      throw new Error('Cart not found')
    }

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

    return items.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0,
    )
  }
}
