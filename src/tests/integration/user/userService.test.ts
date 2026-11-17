import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { prisma } from '@/lib/prisma'
import { UserService } from '@/features/shop/services/UserService'

describe('UserService integration', () => {
  let userId: string
  let otherUserId: string
  let categoryId: number
  let productId: number
  let cartId: string
  let orderId: string

  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const email = `user-service-${suffix}@example.com`
  const phone = `+1555${String(Date.now()).slice(-7)}`

  const addressData = {
    firstName: 'Test',
    lastName: 'User',
    phone: '+15551234567',
    email: 'address@example.com',
    province: 'Test Province',
    city: 'Test City',
    address: '123 Integration Test Street',
    postalCode: '12345',
  }

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: { email, phone },
    })
    userId = user.id

    const otherUser = await prisma.user.create({
      data: { email: `other-${suffix}@example.com` },
    })
    otherUserId = otherUser.id

    const category = await prisma.category.create({
      data: {
        name: `Test Category ${suffix}`,
        iconPath: '/test-category.svg',
      },
    })
    categoryId = category.id

    const product = await prisma.product.create({
      data: {
        title: `Test Product ${suffix}`,
        price: 1000,
        image: '/test-product.jpg',
        description: 'Integration test product',
        slug: `test-product-${suffix}`,
        solution: 'Test solution',
        categoryId,
      },
    })
    productId = product.id
  })

  afterEach(async () => {
    // Delete dependent records before their referenced records.
    if (orderId!) {
      await prisma.orderItem.deleteMany({ where: { orderId } })
      await prisma.order.deleteMany({ where: { id: orderId } })
    }

    if (cartId!) {
      await prisma.cartItem.deleteMany({ where: { cartId } })
      await prisma.cart.deleteMany({ where: { id: cartId } })
    }

    if (userId!) {
      await prisma.address.deleteMany({ where: { userId } })
    }
    if (otherUserId!) {
      await prisma.address.deleteMany({ where: { userId: otherUserId } })
    }

    if (userId!) {
      await prisma.user.deleteMany({ where: { id: userId } })
    }
    if (otherUserId!) {
      await prisma.user.deleteMany({ where: { id: otherUserId } })
    }

    if (productId!) {
      await prisma.product.deleteMany({ where: { id: productId } })
    }
    if (categoryId!) {
      await prisma.category.deleteMany({ where: { id: categoryId } })
    }

    userId = ''
    otherUserId = ''
    categoryId = 0
    productId = 0
    cartId = ''
    orderId = ''
  })

  describe('createUser', () => {
    it('creates and persists a user identified by email', async () => {
      const identifier = `new-${suffix}@example.com`

      const user = await UserService.createUser(identifier, 'email')

      expect(user.email).toBe(identifier)
      await expect(
        prisma.user.findUnique({ where: { email: identifier } }),
      ).resolves.toMatchObject({ id: user.id, email: identifier })
    })

    it('returns the existing user when the email already exists', async () => {
      const user = await UserService.createUser(email, 'email')

      expect(user.id).toBe(userId)
      expect(await prisma.user.count({ where: { email } })).toBe(1)
    })

    it('creates and reuses a user identified by phone', async () => {
      const identifier = `+1666${String(Date.now()).slice(-7)}`

      const created = await UserService.createUser(identifier, 'phone')
      const reused = await UserService.createUser(identifier, 'phone')

      expect(created.phone).toBe(identifier)
      expect(reused.id).toBe(created.id)
      expect(await prisma.user.count({ where: { phone: identifier } })).toBe(1)
    })
  })

  describe('address management', () => {
    it('makes the first address default and persists later addresses as non-default', async () => {
      const first = await UserService.createAddress(userId, addressData)
      const second = await UserService.createAddress(userId, {
        ...addressData,
        address: '456 Second Test Street',
      })

      const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
      })

      expect(first.isDefault).toBe(true)
      expect(second.isDefault).toBe(false)
      expect(addresses).toHaveLength(2)
      expect(addresses[0].isDefault).toBe(true)
      expect(addresses[1].isDefault).toBe(false)
    })

    it('allows a later address to be explicitly marked default', async () => {
      await UserService.createAddress(userId, addressData)

      const second = await UserService.createAddress(userId, {
        ...addressData,
        address: '456 Second Test Street',
        isDefault: true,
      })

      expect(second.isDefault).toBe(true)
    })

    it('updates an address belonging to its owner', async () => {
      const address = await UserService.createAddress(userId, addressData)

      await UserService.updateAddress(address.id, userId, {
        city: 'Updated Test City',
        address: 'Updated Test Street',
      })

      await expect(
        prisma.address.findUnique({ where: { id: address.id } }),
      ).resolves.toMatchObject({
        city: 'Updated Test City',
        address: 'Updated Test Street',
        userId,
      })
    })

    it('does not update an address through another user ID', async () => {
      const address = await UserService.createAddress(userId, addressData)

      await expect(
        UserService.updateAddress(address.id, otherUserId, {
          city: 'Unauthorized City',
        }),
      ).rejects.toThrow()

      await expect(
        prisma.address.findUnique({ where: { id: address.id } }),
      ).resolves.toMatchObject({ city: addressData.city, userId })
    })

    it('deletes an address belonging to its owner', async () => {
      const address = await UserService.createAddress(userId, addressData)

      await UserService.deleteAddress(address.id, userId)

      await expect(
        prisma.address.findUnique({ where: { id: address.id } }),
      ).resolves.toBeNull()
    })

    it('does not delete an address through another user ID', async () => {
      const address = await UserService.createAddress(userId, addressData)

      await expect(
        UserService.deleteAddress(address.id, otherUserId),
      ).rejects.toThrow()

      await expect(
        prisma.address.findUnique({ where: { id: address.id } }),
      ).resolves.toMatchObject({ id: address.id, userId })
    })

    it('sets one address as default without changing another user’s addresses', async () => {
      const first = await UserService.createAddress(userId, addressData)
      const second = await UserService.createAddress(userId, {
        ...addressData,
        address: '456 Second Test Street',
      })
      const otherAddress = await UserService.createAddress(
        otherUserId,
        addressData,
      )

      await UserService.setDefaultAddress(second.id, userId)

      const ownAddresses = await prisma.address.findMany({
        where: { userId },
      })
      const persistedOtherAddress = await prisma.address.findUnique({
        where: { id: otherAddress.id },
      })

      expect(
        ownAddresses.find((address) => address.id === first.id)?.isDefault,
      ).toBe(false)
      expect(
        ownAddresses.find((address) => address.id === second.id)?.isDefault,
      ).toBe(true)
      expect(persistedOtherAddress?.isDefault).toBe(true)
    })

    it('fetches addresses with default addresses first', async () => {
      const first = await UserService.createAddress(userId, addressData)
      const second = await UserService.createAddress(userId, {
        ...addressData,
        address: '456 Second Test Street',
      })

      await UserService.setDefaultAddress(second.id, userId)

      const result = await UserService.fetchUserWithAddresses(userId)

      expect(result?.addresses.map((address) => address.id)).toEqual([
        second.id,
        first.id,
      ])
    })

    it('preserves the existing default when the selected address does not belong to the user', async () => {
      const existingDefault = await UserService.createAddress(
        userId,
        addressData,
      )
      const otherUserAddress = await UserService.createAddress(otherUserId, {
        ...addressData,
        address: 'Another User Street',
      })

      await expect(
        UserService.setDefaultAddress(otherUserAddress.id, userId),
      ).rejects.toThrow()

      await expect(
        prisma.address.findUnique({
          where: { id: existingDefault.id },
        }),
      ).resolves.toMatchObject({ isDefault: true })

      await expect(
        prisma.address.findUnique({
          where: { id: otherUserAddress.id },
        }),
      ).resolves.toMatchObject({
        isDefault: true,
        userId: otherUserId,
      })
    })
  })

  describe('user reads and profile updates', () => {
    it('fetches the current user with the expected persisted profile', async () => {
      const result = await UserService.fetchCurrentUser(userId)

      expect(result).toEqual({
        id: userId,
        firstName: null,
        lastName: null,
        email,
        phone,
      })
    })

    it('fetches users including the created user', async () => {
      const result = await UserService.fetchAllUsers()

      expect(result).toContainEqual({ id: userId, email, phone })
      expect(result).toContainEqual({
        id: otherUserId,
        email: `other-${suffix}@example.com`,
        phone: null,
      })
    })

    it('persists profile updates', async () => {
      await UserService.updateUserProfile(userId, {
        firstName: 'Updated',
        lastName: 'Profile',
        phone: '+17771234567',
      })

      await expect(
        prisma.user.findUnique({ where: { id: userId } }),
      ).resolves.toMatchObject({
        firstName: 'Updated',
        lastName: 'Profile',
        phone: '+17771234567',
      })
    })
  })

  describe('fetchUserWithOrders', () => {
    it('fetches an order with its items and related product', async () => {
      const cart = await prisma.cart.create({
        data: { userId },
      })
      cartId = cart.id

      const order = await prisma.order.create({
        data: {
          userId,
          cartId,
          totalPrice: 2000,
          shippingAddress: '123 Test Street',
          shippingCity: 'Test City',
          shippingEmail: email,
          shippingFirstName: 'Test',
          shippingLastName: 'User',
          shippingPhone: '+15551234567',
          shippingPostalCode: '12345',
          shippingProvince: 'Test Province',
          items: {
            create: {
              productId,
              quantity: 2,
              price: 1000,
            },
          },
        },
      })
      orderId = order.id

      const result = await UserService.fetchUserWithOrders(userId)

      expect(result?.orders).toHaveLength(1)
      expect(result?.orders[0]).toMatchObject({
        id: orderId,
        items: [
          {
            productId,
            quantity: 2,
            price: 1000,
            product: {
              id: productId,
              title: `Test Product ${suffix}`,
              price: 1000,
              image: '/test-product.jpg',
              slug: `test-product-${suffix}`,
            },
          },
        ],
      })
    })
  })
})
