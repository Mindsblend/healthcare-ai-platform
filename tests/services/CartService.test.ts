import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    cart: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },

    product: {
      findFirst: vi.fn(),
    },

    cartItem: {
      upsert: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
      findMany: vi.fn(),
    },

    $transaction: vi.fn(),
  },
}))

import { prisma } from '@/lib/prisma'
import { CartService } from '@/features/shop/services/CartService'

describe('CartService.fetchActiveCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return the active cart with its items and product information', async () => {
    const cart = {
      id: 'cart-1',
      userId: 'user-1',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          cartId: 'cart-1',
          quantity: 2,
          price: 100000,
          product: {
            id: 'product-1',
            title: 'Test Product',
            price: 100000,
            solution: 'Test solution',
            slug: 'test-product',
            image: '/images/product.webp',
            categoryId: 'category-1',
            category: {
              name: 'Test Category',
              iconPath: '/images/category.webp',
            },
          },
        },
      ],
    }

    vi.mocked(prisma.cart.findFirst).mockResolvedValue(cart as any)

    const result = await CartService.fetchActiveCart({
      userId: 'user-1',
    })

    expect(prisma.cart.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          userId: 'user-1',
          status: 'ACTIVE',
        },
      }),
    )

    expect(result).toEqual({
      id: 'cart-1',
      userId: 'user-1',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          cartId: 'cart-1',
          quantity: 2,
          price: 100000,
          product: {
            id: 'product-1',
            title: 'Test Product',
            price: 100000,
            solution: 'Test solution',
            slug: 'test-product',
            image: '/images/product.webp',
            categoryId: 'category-1',
            category: {
              name: 'Test Category',
              iconPath: '/images/category.webp',
            },
          },
        },
      ],
    })
  })

  it('should return null when active cart does not exist', async () => {
    vi.mocked(prisma.cart.findFirst).mockResolvedValue(null)

    const result = await CartService.fetchActiveCart({
      userId: 'user-1',
    })

    expect(result).toBeNull()
  })
})

describe('CartService.createCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return the existing active cart', async () => {
    const existingCart = {
      id: 'cart-1',
      userId: 'user-1',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          cartId: 'cart-1',
          quantity: 2,
          price: 100000,
          product: {
            id: 'product-1',
            title: 'Test Product',
            price: 100000,
            solution: 'Test solution',
            slug: 'test-product',
            image: '/images/product.webp',
            categoryId: 'category-1',
            category: {
              name: 'Test Category',
              iconPath: '/images/category.webp',
            },
          },
        },
      ],
    }

    vi.mocked(prisma.cart.findFirst).mockResolvedValue(existingCart as any)

    const result = await CartService.createCart({
      userId: 'user-1',
    })

    expect(prisma.cart.findFirst).toHaveBeenCalled()

    expect(result).toEqual({
      id: 'cart-1',
      userId: 'user-1',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          cartId: 'cart-1',
          quantity: 2,
          price: 100000,
          product: {
            id: 'product-1',
            title: 'Test Product',
            price: 100000,
            solution: 'Test solution',
            slug: 'test-product',
            image: '/images/product.webp',
            categoryId: 'category-1',
            category: {
              name: 'Test Category',
              iconPath: '/images/category.webp',
            },
          },
        },
      ],
    })
  })

  it('should create a new active cart when one does not exist', async () => {
    vi.mocked(prisma.cart.findFirst).mockResolvedValue(null)

    vi.mocked(prisma.cart.create).mockResolvedValue({
      id: 'cart-2',
      userId: 'user-1',
      status: 'ACTIVE',
    } as any)

    const result = await CartService.createCart({
      userId: 'user-1',
    })

    expect(prisma.cart.create).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        status: 'ACTIVE',
      },
    })

    expect(result).toEqual({
      id: 'cart-2',
      userId: 'user-1',
      status: 'ACTIVE',
      items: [],
    })
  })
})

describe('CartService.addItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      return callback(prisma)
    })
  })

  it('should add a product to the cart', async () => {
    const cart = {
      id: 'cart-1',
    }

    const product = {
      price: 100000,
    }

    const cartItem = {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 2,
      price: 100000,
    }

    vi.mocked(prisma.cart.findFirst).mockResolvedValue(cart as any)

    vi.mocked(prisma.product.findFirst).mockResolvedValue(product as any)

    vi.mocked(prisma.cartItem.upsert).mockResolvedValue(cartItem as any)

    const result = await CartService.addItem(
      {
        cartId: 'cart-1',
        productId: 'product-1',
        quantity: 2,
      },
      'user-1',
    )

    expect(prisma.cart.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'cart-1',
        userId: 'user-1',
        status: 'ACTIVE',
      },
      select: {
        id: true,
      },
    })

    expect(prisma.product.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'product-1',
        isActive: true,
      },
      select: {
        price: true,
      },
    })

    expect(prisma.cartItem.upsert).toHaveBeenCalledWith({
      where: {
        cartId_productId: {
          cartId: 'cart-1',
          productId: 'product-1',
        },
      },
      update: {
        quantity: {
          increment: 2,
        },
      },
      create: {
        cartId: 'cart-1',
        productId: 'product-1',
        quantity: 2,
        price: 100000,
      },
    })

    expect(result).toEqual(cartItem)
  })

  it('should use quantity 1 by default', async () => {
    vi.mocked(prisma.cart.findFirst).mockResolvedValue({
      id: 'cart-1',
    } as any)

    vi.mocked(prisma.product.findFirst).mockResolvedValue({
      price: 100000,
    } as any)

    const cartItemUpsertMock = vi
      .mocked(prisma.cartItem.upsert)
      .mockResolvedValue({
        id: 'item-1',
        cartId: 'cart-1',
        productId: 'product-1',
        quantity: 1,
        price: 100000,
      } as any)

    await CartService.addItem(
      {
        cartId: 'cart-1',
        productId: 'product-1',
      },
      'user-1',
    )

    expect(cartItemUpsertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        update: {
          quantity: {
            increment: 1,
          },
        },
        create: {
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 1,
          price: 100000,
        },
      }),
    )
  })

  it('should reject invalid quantity', async () => {
    await expect(
      CartService.addItem(
        {
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 0,
        },
        'user-1',
      ),
    ).rejects.toThrow('Quantity must be a positive integer')
  })

  it('should reject non-integer quantity', async () => {
    await expect(
      CartService.addItem(
        {
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 1.5,
        },
        'user-1',
      ),
    ).rejects.toThrow('Quantity must be a positive integer')
  })

  it('should reject when active cart does not exist', async () => {
    vi.mocked(prisma.cart.findFirst).mockResolvedValue(null)

    await expect(
      CartService.addItem(
        {
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 2,
        },
        'user-1',
      ),
    ).rejects.toThrow('Active cart not found')

    expect(prisma.product.findFirst).not.toHaveBeenCalled()
    expect(prisma.cartItem.upsert).not.toHaveBeenCalled()
  })

  it('should reject when product does not exist', async () => {
    vi.mocked(prisma.cart.findFirst).mockResolvedValue({
      id: 'cart-1',
    } as any)

    vi.mocked(prisma.product.findFirst).mockResolvedValue(null)

    await expect(
      CartService.addItem(
        {
          cartId: 'cart-1',
          productId: 'product-1',
          quantity: 2,
        },
        'user-1',
      ),
    ).rejects.toThrow('Product not found')

    expect(prisma.cartItem.upsert).not.toHaveBeenCalled()
  })
})

describe('CartService.updateItemQuantity', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update cart item quantity', async () => {
    const updatedItem = {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 5,
      price: 100000,
    }

    vi.mocked(prisma.cartItem.update).mockResolvedValue(updatedItem as any)

    const result = await CartService.updateItemQuantity({
      cartItemId: 'item-1',
      quantity: 5,
    })

    expect(prisma.cartItem.update).toHaveBeenCalledWith({
      where: {
        id: 'item-1',
      },
      data: {
        quantity: 5,
      },
    })

    expect(result).toEqual(updatedItem)
  })

  it('should delete cart item when quantity is zero', async () => {
    const deletedItem = {
      id: 'item-1',
    }

    vi.mocked(prisma.cartItem.delete).mockResolvedValue(deletedItem as any)

    const result = await CartService.updateItemQuantity({
      cartItemId: 'item-1',
      quantity: 0,
    })

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({
      where: {
        id: 'item-1',
      },
    })

    expect(result).toEqual(deletedItem)
  })

  it('should delete cart item when quantity is negative', async () => {
    vi.mocked(prisma.cartItem.delete).mockResolvedValue({
      id: 'item-1',
    } as any)

    await CartService.updateItemQuantity({
      cartItemId: 'item-1',
      quantity: -1,
    })

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({
      where: {
        id: 'item-1',
      },
    })
  })
})

describe('CartService.removeItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should remove a cart item', async () => {
    const deletedItem = {
      id: 'item-1',
      cartId: 'cart-1',
      productId: 'product-1',
      quantity: 2,
      price: 100000,
    }

    vi.mocked(prisma.cartItem.delete).mockResolvedValue(deletedItem as any)

    const result = await CartService.removeItem({
      cartItemId: 'item-1',
    })

    expect(prisma.cartItem.delete).toHaveBeenCalledWith({
      where: {
        id: 'item-1',
      },
    })

    expect(result).toEqual(deletedItem)
  })
})

describe('CartService.clearCart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should remove all items from a cart', async () => {
    vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({
      count: 2,
    })

    const result = await CartService.clearCart({
      cartId: 'cart-1',
    })

    expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: {
        cartId: 'cart-1',
      },
    })

    expect(result).toEqual({
      count: 2,
    })
  })

  it('should work when cart has no items', async () => {
    vi.mocked(prisma.cartItem.deleteMany).mockResolvedValue({
      count: 0,
    })

    const result = await CartService.clearCart({
      cartId: 'cart-1',
    })

    expect(result).toEqual({
      count: 0,
    })

    expect(prisma.cartItem.deleteMany).toHaveBeenCalledWith({
      where: {
        cartId: 'cart-1',
      },
    })
  })
})

describe('CartService.calculateTotal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should calculate the total cart price', async () => {
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([
      {
        id: 'item-1',
        cartId: 'cart-1',
        productId: 'product-1',
        quantity: 2,
        price: 100000,
      },
      {
        id: 'item-2',
        cartId: 'cart-1',
        productId: 'product-2',
        quantity: 3,
        price: 50000,
      },
    ] as any)

    const result = await CartService.calculateTotal({
      cartId: 'cart-1',
    })

    expect(prisma.cartItem.findMany).toHaveBeenCalledWith({
      where: {
        cartId: 'cart-1',
      },
    })

    expect(result).toBe(350000)
  })

  it('should return zero when cart is empty', async () => {
    vi.mocked(prisma.cartItem.findMany).mockResolvedValue([])

    const result = await CartService.calculateTotal({
      cartId: 'cart-1',
    })

    expect(result).toBe(0)

    expect(prisma.cartItem.findMany).toHaveBeenCalledWith({
      where: {
        cartId: 'cart-1',
      },
    })
  })
})
