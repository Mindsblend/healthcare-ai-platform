import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { CartService } from '@/features/shop/services/CartService'

describe('CartService integration', () => {
  let userId: string
  let categoryId: number
  let productId: number

  beforeEach(async () => {
    // Create isolated fixtures for this test.
    const user = await prisma.user.create({
      data: {
        email: `cart-test-${crypto.randomUUID()}@example.com`,
      },
    })
    userId = user.id

    const category = await prisma.category.create({
      data: {
        name: `Cart Test ${crypto.randomUUID()}`,
        iconPath: '/test.svg',
      },
    })
    categoryId = category.id

    const product = await prisma.product.create({
      data: {
        title: `Cart Test Product ${crypto.randomUUID()}`,
        slug: `cart-test-${crypto.randomUUID()}`,
        price: 2500,
        image: '/test-product.jpg',
        description: 'Integration test product',
        solution: 'Integration test',
        categoryId,
        isActive: true,
      },
    })
    productId = product.id
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('creates an active cart for a user', async () => {
    const cart = await CartService.createCart({ userId })

    expect(cart).not.toBeNull()
    expect(cart?.userId).toBe(userId)
    expect(cart?.status).toBe('ACTIVE')
    expect(cart?.items).toHaveLength(0)

    const savedCart = await prisma.cart.findUnique({
      where: { id: cart!.id },
    })

    expect(savedCart?.userId).toBe(userId)
    expect(savedCart?.status).toBe('ACTIVE')
  })

  afterEach(async () => {
    await prisma.cartItem.deleteMany({
      where: { cart: { userId } },
    })

    await prisma.cart.deleteMany({
      where: { userId },
    })

    if (productId !== undefined) {
      await prisma.product.deleteMany({
        where: { id: productId },
      })
    }

    if (categoryId !== undefined) {
      await prisma.category.deleteMany({
        where: { id: categoryId },
      })
    }

    if (userId !== undefined) {
      await prisma.user.deleteMany({
        where: { id: userId },
      })
    }
  })

  it('returns the existing active cart instead of creating a duplicate', async () => {
    const first = await CartService.createCart({ userId })
    const second = await CartService.createCart({ userId })

    expect(second?.id).toBe(first?.id)

    const activeCartCount = await prisma.cart.count({
      where: { userId, status: 'ACTIVE' },
    })

    expect(activeCartCount).toBe(1)
  })

  it('rejects adding an item to another user’s cart', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const otherUser = await prisma.user.create({
      data: {
        email: `other-cart-owner-${crypto.randomUUID()}@example.com`,
      },
    })

    try {
      await expect(
        CartService.addItem(
          {
            cartId: cart.id,
            productId,
            quantity: 1,
          },
          otherUser.id,
        ),
      ).rejects.toThrow('Active cart not found')

      const items = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
      })

      expect(items).toHaveLength(0)
    } finally {
      await prisma.user.delete({
        where: { id: otherUser.id },
      })
    }
  })

  it('adds a product and persists its price and quantity', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const item = await CartService.addItem(
      { cartId: cart.id, productId, quantity: 2 },
      userId,
    )

    expect(item.cartId).toBe(cart.id)
    expect(item.productId).toBe(productId)
    expect(item.quantity).toBe(2)
    expect(item.price).toBe(2500)

    const savedItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    })

    expect(savedItem?.quantity).toBe(2)
    expect(savedItem?.price).toBe(2500)
  })

  it('increments quantity when the same product is added again', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    await CartService.addItem(
      { cartId: cart.id, productId, quantity: 2 },
      userId,
    )

    await CartService.addItem(
      { cartId: cart.id, productId, quantity: 3 },
      userId,
    )

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id, productId },
    })

    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(5)
    expect(items[0].price).toBe(2500)
  })

  it('rejects zero and negative quantities', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    await expect(
      CartService.addItem({ cartId: cart.id, productId, quantity: 0 }, userId),
    ).rejects.toThrow('Quantity must be a positive integer')

    await expect(
      CartService.addItem({ cartId: cart.id, productId, quantity: -1 }, userId),
    ).rejects.toThrow('Quantity must be a positive integer')

    const items = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    })

    expect(items).toHaveLength(0)
  })

  it("updates and persists an item's quantity", async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const item = await CartService.addItem(
      { cartId: cart.id, productId, quantity: 2 },
      userId,
    )

    const updatedItem = await CartService.updateItemQuantity(
      {
        cartItemId: item.id,
        quantity: 4,
      },
      userId,
    )

    expect(updatedItem.quantity).toBe(4)

    const savedItem = await prisma.cartItem.findUnique({
      where: { id: item.id },
    })

    expect(savedItem?.quantity).toBe(4)
  })

  it('rejects updating an item in another user’s cart', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const item = await CartService.addItem(
      { cartId: cart.id, productId, quantity: 2 },
      userId,
    )

    const otherUser = await prisma.user.create({
      data: {
        email: `other-update-user-${crypto.randomUUID()}@example.com`,
      },
    })

    try {
      await expect(
        CartService.updateItemQuantity(
          {
            cartItemId: item.id,
            quantity: 5,
          },
          otherUser.id,
        ),
      ).rejects.toThrow('Cart item not found')

      const savedItem = await prisma.cartItem.findUnique({
        where: { id: item.id },
      })

      expect(savedItem?.quantity).toBe(2)
    } finally {
      await prisma.user.delete({
        where: { id: otherUser.id },
      })
    }
  })

  it('rejects removing an item from another user’s cart', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const item = await CartService.addItem(
      { cartId: cart.id, productId, quantity: 2 },
      userId,
    )

    const otherUser = await prisma.user.create({
      data: {
        email: `other-remove-user-${crypto.randomUUID()}@example.com`,
      },
    })

    try {
      await expect(
        CartService.removeItem({ cartItemId: item.id }, otherUser.id),
      ).rejects.toThrow('Cart item not found')

      const savedItem = await prisma.cartItem.findUnique({
        where: { id: item.id },
      })

      expect(savedItem).not.toBeNull()
    } finally {
      await prisma.user.delete({
        where: { id: otherUser.id },
      })
    }
  })

  it('removes an item from the database', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const item = await CartService.addItem(
      { cartId: cart.id, productId, quantity: 1 },
      userId,
    )

    await CartService.removeItem({ cartItemId: item.id }, userId)

    const deletedItem = await prisma.cartItem.findUnique({
      where: { id: item.id },
    })

    expect(deletedItem).toBeNull()
  })

  it('rejects clearing another user’s cart', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    await CartService.addItem(
      { cartId: cart.id, productId, quantity: 2 },
      userId,
    )

    const otherUser = await prisma.user.create({
      data: {
        email: `other-clear-user-${crypto.randomUUID()}@example.com`,
      },
    })

    try {
      await expect(
        CartService.clearCart({ cartId: cart.id }, otherUser.id),
      ).rejects.toThrow('Cart not found')

      const remainingItems = await prisma.cartItem.findMany({
        where: { cartId: cart.id },
      })

      expect(remainingItems).toHaveLength(1)
      expect(remainingItems[0].quantity).toBe(2)
    } finally {
      await prisma.user.delete({
        where: { id: otherUser.id },
      })
    }
  })

  it('clears only the specified cart', async () => {
    const firstCart = await CartService.createCart({ userId })
    if (!firstCart) throw new Error('First cart was not created')

    // Create a second cart directly because createCart reuses
    // an existing active cart for this user.
    const secondCart = await prisma.cart.create({
      data: {
        userId,
        status: 'ACTIVE',
      },
    })

    await CartService.addItem(
      {
        cartId: firstCart.id,
        productId,
        quantity: 1,
      },
      userId,
    )

    await CartService.addItem(
      {
        cartId: secondCart.id,
        productId,
        quantity: 2,
      },
      userId,
    )

    await CartService.clearCart({ cartId: firstCart.id }, userId)

    const firstCartItems = await prisma.cartItem.findMany({
      where: { cartId: firstCart.id },
    })

    const secondCartItems = await prisma.cartItem.findMany({
      where: { cartId: secondCart.id },
    })

    expect(firstCartItems).toHaveLength(0)
    expect(secondCartItems).toHaveLength(1)
    expect(secondCartItems[0].quantity).toBe(2)
  })

  it('calculates the total from item prices and quantities', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    await CartService.addItem(
      { cartId: cart.id, productId, quantity: 3 },
      userId,
    )

    const total = await CartService.calculateTotal({
      cartId: cart.id,
    })

    expect(total).toBe(7500)
  })

  it('fetches an active cart with its product details', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    await CartService.addItem(
      { cartId: cart.id, productId, quantity: 2 },
      userId,
    )

    const fetchedCart = await CartService.fetchActiveCart({ userId })

    expect(fetchedCart?.id).toBe(cart.id)
    expect(fetchedCart?.userId).toBe(userId)
    expect(fetchedCart?.status).toBe('ACTIVE')
    expect(fetchedCart?.items).toHaveLength(1)
    expect(fetchedCart?.items[0].quantity).toBe(2)
    expect(fetchedCart?.items[0].product.id).toBe(productId)
    expect(fetchedCart?.items[0].product.price).toBe(2500)
  })

  it('returns null when the user has no active cart', async () => {
    const fetchedCart = await CartService.fetchActiveCart({ userId })

    expect(fetchedCart).toBeNull()
  })

  it('rejects fractional quantities when updating an item', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const item = await CartService.addItem(
      { cartId: cart.id, productId, quantity: 2 },
      userId,
    )

    await expect(
      CartService.updateItemQuantity(
        {
          cartItemId: item.id,
          quantity: 1.5,
        },
        userId,
      ),
    ).rejects.toThrow('Quantity must be an integer')

    const savedItem = await prisma.cartItem.findUnique({
      where: { id: item.id },
    })

    expect(savedItem?.quantity).toBe(2)
  })

  it('deletes an item when its quantity is set to zero', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const item = await CartService.addItem(
      { cartId: cart.id, productId, quantity: 2 },
      userId,
    )

    await CartService.updateItemQuantity(
      {
        cartItemId: item.id,
        quantity: 0,
      },
      userId,
    )

    const savedItem = await prisma.cartItem.findUnique({
      where: { id: item.id },
    })

    expect(savedItem).toBeNull()
  })

  it('returns an empty items array for a cart with no items', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const fetchedCart = await CartService.fetchActiveCart({ userId })

    expect(fetchedCart).not.toBeNull()
    expect(fetchedCart?.id).toBe(cart.id)
    expect(fetchedCart?.items).toEqual([])
  })

  it('calculates zero for an empty cart', async () => {
    const cart = await CartService.createCart({ userId })
    if (!cart) throw new Error('Cart was not created')

    const total = await CartService.calculateTotal({
      cartId: cart.id,
    })

    expect(total).toBe(0)
  })
})
