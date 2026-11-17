import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CartService } from '@/features/shop/services/CartService'
import { prisma } from '@/lib/prisma'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    cart: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    cartItem: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

describe('CartService.calculateTotal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when the cart contains multiple items', () => {
    it('calculates the total price correctly', async () => {
      // Arrange
      vi.mocked(prisma.cartItem.findMany).mockResolvedValue([
        { price: 100, quantity: 2 },
        { price: 250, quantity: 3 },
      ] as any)

      // Act
      const result = await CartService.calculateTotal({
        cartId: 'cart-123',
      })

      // Assert
      expect(result).toBe(950)

      expect(prisma.cartItem.findMany).toHaveBeenCalledWith({
        where: {
          cartId: 'cart-123',
        },
      })
    })
  })

  describe('when the cart is empty', () => {
    it('returns zero', async () => {
      // Arrange
      vi.mocked(prisma.cartItem.findMany).mockResolvedValue([])

      // Act
      const result = await CartService.calculateTotal({
        cartId: 'cart-123',
      })

      // Assert
      expect(result).toBe(0)
    })
  })
})

describe('CartService.updateItemQuantity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when quantity is positive', () => {
    it('updates the cart item quantity', async () => {
      // Arrange
      const updatedItem = {
        id: 123,
        quantity: 3,
      }

      vi.mocked(prisma.cartItem.findFirst).mockResolvedValue({ id: 123 } as any)

      vi.mocked(prisma.cartItem.update).mockResolvedValue(updatedItem as any)

      // Act
      const result = await CartService.updateItemQuantity(
        {
          cartItemId: 123,
          quantity: 3,
        },
        'user-123',
      )

      // Assert
      expect(result).toEqual(updatedItem)

      expect(prisma.cartItem.update).toHaveBeenCalledWith({
        where: {
          id: 123,
        },
        data: {
          quantity: 3,
        },
      })
    })
  })

  describe('when quantity is zero', () => {
    it('removes the cart item', async () => {
      // Arrange
      const deletedItem = {
        id: 123,
        quantity: 2,
      }

      vi.mocked(prisma.cartItem.delete).mockResolvedValue(deletedItem as any)

      // Act
      const result = await CartService.updateItemQuantity(
        {
          cartItemId: 123,
          quantity: 0,
        },
        'user-123',
      )

      // Assert
      expect(result).toEqual(deletedItem)

      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: {
          id: 123,
        },
      })

      expect(prisma.cartItem.update).not.toHaveBeenCalled()
    })
  })

  describe('CartService.removeItem', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('removes the cart item', async () => {
      // Arrange
      const deletedItem = {
        id: 123,
        quantity: 2,
      }

      vi.mocked(prisma.cartItem.delete).mockResolvedValue(deletedItem as any)

      // Act
      const result = await CartService.removeItem(
        {
          cartItemId: 123,
        },
        'user-123',
      )

      // Assert
      expect(result).toEqual(deletedItem)

      expect(prisma.cartItem.delete).toHaveBeenCalledWith({
        where: {
          id: 123,
        },
      })
    })
  })

  describe('CartService.clearCart', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    it('removes all items from the cart', async () => {
      vi.mocked(prisma.cart.findFirst).mockResolvedValue({
        id: 'cart-123',
      } as any)

      vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({
        count: 3,
      })

      const result = await CartService.clearCart(
        { cartId: 'cart-123' },
        'user-123',
      )

      expect(result).toEqual({ count: 3 })

      expect(prisma.cart.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cart-123',
          userId: 'user-123',
        },
        select: {
          id: true,
        },
      })

      expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: 'cart-123' },
      })
    })
  })
})

describe('CartService.addItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when quantity is invalid', () => {
    it('throws an error when quantity is zero', async () => {
      // Arrange
      const input = {
        cartId: 'cart-123',
        productId: 456,
        quantity: 0,
      }

      // Act
      const action = CartService.addItem(input, 'user-123')

      // Assert
      await expect(action).rejects.toThrow(
        'Quantity must be a positive integer',
      )
    })

    it('throws an error when quantity is negative', async () => {
      // Arrange
      const input = {
        cartId: 'cart-123',
        productId: 456,
        quantity: -1,
      }

      // Act
      const action = CartService.addItem(input, 'user-123')

      // Assert
      await expect(action).rejects.toThrow(
        'Quantity must be a positive integer',
      )
    })
  })

  describe('when the active cart does not exist', () => {
    it('throws an error', async () => {
      // Arrange
      const tx = {
        cart: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      }

      vi.mocked(prisma.$transaction).mockImplementation(
        async (callback: (tx: any) => Promise<any>) => {
          return callback(tx)
        },
      )

      // Act
      const action = CartService.addItem(
        {
          cartId: 'cart-123',
          productId: 456,
          quantity: 1,
        },
        'user-123',
      )

      // Assert
      await expect(action).rejects.toThrow('Active cart not found')

      expect(tx.cart.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cart-123',
          userId: 'user-123',
          status: 'ACTIVE',
        },
        select: {
          id: true,
        },
      })
    })
  })

  describe('when the product does not exist', () => {
    it('throws an error', async () => {
      // Arrange
      const tx = {
        cart: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'cart-123',
          }),
        },
        product: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      }

      vi.mocked(prisma.$transaction).mockImplementation(
        async (callback: (tx: any) => Promise<any>) => {
          return callback(tx)
        },
      )

      // Act
      const action = CartService.addItem(
        {
          cartId: 'cart-123',
          productId: 456,
          quantity: 1,
        },
        'user-123',
      )

      // Assert
      await expect(action).rejects.toThrow('Product not found')

      expect(tx.product.findFirst).toHaveBeenCalledWith({
        where: {
          id: 456,
          isActive: true,
        },
        select: {
          price: true,
        },
      })
    })
  })

  describe('when the cart and product are valid', () => {
    it('upserts the cart item with the product price', async () => {
      // Arrange
      const product = {
        price: 250,
      }

      const cartItem = {
        id: 789,
        cartId: 'cart-123',
        productId: 456,
        quantity: 2,
        price: 250,
      }

      const tx = {
        cart: {
          findFirst: vi.fn().mockResolvedValue({
            id: 'cart-123',
          }),
        },

        product: {
          findFirst: vi.fn().mockResolvedValue(product),
        },

        cartItem: {
          upsert: vi.fn().mockResolvedValue(cartItem),
        },
      }

      vi.mocked(prisma.$transaction).mockImplementation(
        async (callback: (tx: any) => Promise<any>) => {
          return callback(tx)
        },
      )

      // Act
      const result = await CartService.addItem(
        {
          cartId: 'cart-123',
          productId: 456,
          quantity: 2,
        },
        'user-123',
      )

      // Assert
      expect(result).toEqual(cartItem)

      expect(tx.cart.findFirst).toHaveBeenCalledWith({
        where: {
          id: 'cart-123',
          userId: 'user-123',
          status: 'ACTIVE',
        },
        select: {
          id: true,
        },
      })

      expect(tx.product.findFirst).toHaveBeenCalledWith({
        where: {
          id: 456,
          isActive: true,
        },
        select: {
          price: true,
        },
      })

      expect(tx.cartItem.upsert).toHaveBeenCalledWith({
        where: {
          cartId_productId: {
            cartId: 'cart-123',
            productId: 456,
          },
        },
        update: {
          quantity: {
            increment: 2,
          },
        },
        create: {
          cartId: 'cart-123',
          productId: 456,
          quantity: 2,
          price: 250,
        },
      })
    })
  })
})

describe('CartService.fetchActiveCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when there is no active cart', () => {
    it('returns null', async () => {
      // Arrange
      vi.mocked(prisma.cart.findFirst).mockResolvedValue(null)

      // Act
      const result = await CartService.fetchActiveCart({
        userId: 'user-123',
      })

      // Assert
      expect(result).toBeNull()

      expect(prisma.cart.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user-123',
          status: 'ACTIVE',
        },
        include: {
          items: {
            orderBy: { id: 'asc' },
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
    })
  })

  describe('when an active cart exists', () => {
    it('returns the cart with its items and product data', async () => {
      // Arrange
      const cart = {
        id: 'cart-123',
        userId: 'user-123',
        status: 'ACTIVE',
        items: [
          {
            id: 1,
            cartId: 'cart-123',
            quantity: 2,
            price: 250,
            product: {
              id: 456,
              title: 'Test Product',
              price: 250,
              solution: 'Test solution',
              slug: 'test-product',
              image: '/test.jpg',
              categoryId: 10,
              category: {
                name: 'Supplements',
                iconPath: '/icons/supplements.svg',
              },
            },
          },
        ],
      }

      vi.mocked(prisma.cart.findFirst).mockResolvedValue(cart as any)

      // Act
      const result = await CartService.fetchActiveCart({
        userId: 'user-123',
      })

      // Assert
      expect(result).toEqual({
        id: 'cart-123',
        userId: 'user-123',
        status: 'ACTIVE',
        items: [
          {
            id: 1,
            cartId: 'cart-123',
            quantity: 2,
            price: 250,
            product: {
              id: 456,
              title: 'Test Product',
              price: 250,
              solution: 'Test solution',
              slug: 'test-product',
              image: '/test.jpg',
              categoryId: 10,
              category: {
                name: 'Supplements',
                iconPath: '/icons/supplements.svg',
              },
            },
          },
        ],
      })
    })

    it('returns an empty cart when the active cart has no items', async () => {
      // Arrange
      const cart = {
        id: 'cart-123',
        userId: 'user-123',
        status: 'ACTIVE',
        items: [],
      }

      vi.mocked(prisma.cart.findFirst).mockResolvedValue(cart as any)

      // Act
      const result = await CartService.fetchActiveCart({
        userId: 'user-123',
      })

      // Assert
      expect(result).toEqual({
        id: 'cart-123',
        userId: 'user-123',
        status: 'ACTIVE',
        items: [],
      })
    })
  })
})

describe('CartService.createCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('when an active cart already exists', () => {
    it('returns the existing cart', async () => {
      // Arrange
      const existingCart = {
        id: 'cart-123',
        userId: 'user-123',
        status: 'ACTIVE',
        items: [
          {
            id: 1,
            cartId: 'cart-123',
            quantity: 2,
            price: 250,
            product: {
              id: 456,
              title: 'Test Product',
              price: 250,
              solution: 'Test solution',
              slug: 'test-product',
              image: '/test.jpg',
              categoryId: 10,
              category: {
                name: 'Supplements',
                iconPath: '/icons/supplements.svg',
              },
            },
          },
        ],
      }

      vi.mocked(prisma.cart.findFirst).mockResolvedValue(existingCart as any)

      // Act
      const result = await CartService.createCart({
        userId: 'user-123',
      })

      // Assert
      expect(result).toEqual({
        id: 'cart-123',
        userId: 'user-123',
        status: 'ACTIVE',
        items: [
          {
            id: 1,
            cartId: 'cart-123',
            quantity: 2,
            price: 250,
            product: {
              id: 456,
              title: 'Test Product',
              price: 250,
              solution: 'Test solution',
              slug: 'test-product',
              image: '/test.jpg',
              categoryId: 10,
              category: {
                name: 'Supplements',
                iconPath: '/icons/supplements.svg',
              },
            },
          },
        ],
      })

      expect(prisma.cart.create).not.toHaveBeenCalled()
    })
  })

  describe('when an active cart does not exist', () => {
    it('creates and returns a new active cart', async () => {
      // Arrange
      vi.mocked(prisma.cart.findFirst).mockResolvedValue(null)

      const createdCart = {
        id: 'cart-456',
        userId: 'user-123',
        status: 'ACTIVE',
      }

      vi.mocked(prisma.cart.create).mockResolvedValue(createdCart as any)

      // Act
      const result = await CartService.createCart({
        userId: 'user-123',
      })

      // Assert
      expect(result).toEqual({
        id: 'cart-456',
        userId: 'user-123',
        status: 'ACTIVE',
        items: [],
      })

      expect(prisma.cart.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          status: 'ACTIVE',
        },
      })
    })
  })
})
