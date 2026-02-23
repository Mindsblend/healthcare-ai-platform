import { prisma } from '@/lib/prisma'
import { CartStatus } from '@prisma/client'

export class CartService {
  // fetch Active Cart
  static async fetchActiveCart(userId: string) {
    return prisma.cart.findFirst({
      where: {
        userId,
        status: CartStatus.ACTIVE,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })
  }

  // Create Cart
  static async createCart(userId: string) {
    const cart = await prisma.cart.create({
      data: {
        userId,
        status: CartStatus.ACTIVE,
      },
    })

    const fullCart = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    return fullCart
  }

  /** Add to Cart */
  static async addItem(cartId: string, productId: number, quantity = 1) {
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
  static async updateItemQuantity(cartItemId: number, quantity: number) {
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
  static async removeItem(cartItemId: number) {
    return prisma.cartItem.delete({
      where: { id: cartItemId },
    })
  }

  /** Empty Carts */
  static async clearCart(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    })
  }

  /** Total cost */
  static async calculateTotal(cartId: string) {
    const items = await prisma.cartItem.findMany({
      where: { cartId },
    })

    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }
}
