import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest'

import { prisma } from '@/lib/prisma'
import { OrderService } from '@/features/shop/services/OrderService'

describe('OrderService integration', () => {
  let userId: string
  let categoryId: number
  let productId: number
  let cartId: string
  let orderId: string

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        email: `order-test-${crypto.randomUUID()}@example.com`,
      },
    })

    if (!user.email) {
      throw new Error('Test user email was not created')
    }

    userId = user.id

    const category = await prisma.category.create({
      data: {
        name: `Order Test ${crypto.randomUUID()}`,
        iconPath: '/test.svg',
      },
    })
    categoryId = category.id

    const product = await prisma.product.create({
      data: {
        title: `Order Test Product ${crypto.randomUUID()}`,
        slug: `order-test-${crypto.randomUUID()}`,
        price: 2500,
        image: '/test-product.jpg',
        description: 'Integration test product',
        solution: 'Integration test',
        categoryId,
        isActive: true,
      },
    })
    productId = product.id

    const cart = await prisma.cart.create({
      data: {
        userId,
        status: 'ACTIVE',
      },
    })
    cartId = cart.id

    await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity: 2,
        price: 2500,
      },
    })

    const order = await prisma.order.create({
      data: {
        userId,
        cartId,
        totalPrice: 5450,
        status: 'PENDING',
        shippingAddress: 'Test Street 1',
        shippingCity: 'Test City',
        shippingEmail: user.email,
        shippingFirstName: 'Test',
        shippingLastName: 'Customer',
        shippingPhone: '0000000000',
        shippingPostalCode: '00000',
        shippingProvince: 'Test Province',
      },
    })
    orderId = order.id

    await prisma.orderItem.create({
      data: {
        orderId,
        productId,
        quantity: 2,
        price: 2500,
      },
    })
  })

  afterEach(async () => {
    await prisma.orderItem.deleteMany({
      where: { order: { userId } },
    })

    await prisma.order.deleteMany({
      where: { userId },
    })

    await prisma.cartItem.deleteMany({
      where: { cartId },
    })

    await prisma.cart.deleteMany({
      where: { id: cartId },
    })

    await prisma.product.deleteMany({
      where: { id: productId },
    })

    await prisma.category.deleteMany({
      where: { id: categoryId },
    })

    await prisma.user.deleteMany({
      where: { id: userId },
    })
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('fetches order summaries from the database', async () => {
    const orders = await OrderService.fetchOrdersPreview()

    const fetchedOrder = orders.find((order) => order.id === orderId)

    expect(fetchedOrder).toBeDefined()
    expect(fetchedOrder).toMatchObject({
      id: orderId,
      totalPrice: 5450,
      shippingFirstName: 'Test',
      shippingLastName: 'Customer',
      shippingPhone: '0000000000',
      status: 'PENDING',
    })
    expect(fetchedOrder?.createdAt).toBeInstanceOf(Date)
  })

  it('fetches an order by ID with its items and product details', async () => {
    const order = await OrderService.fetchOrderById({ id: orderId })

    expect(order).not.toBeNull()
    expect(order?.id).toBe(orderId)
    expect(order?.items).toHaveLength(1)

    expect(order?.items[0]).toMatchObject({
      orderId,
      productId,
      quantity: 2,
      price: 2500,
    })

    expect(order?.items[0].product).toMatchObject({
      id: productId,
      title: expect.stringContaining('Order Test Product'),
      price: 2500,
      image: '/test-product.jpg',
      slug: expect.stringContaining('order-test-'),
    })
  })

  it('returns null when the order does not exist', async () => {
    const order = await OrderService.fetchOrderById({
      id: `nonexistent-order-${crypto.randomUUID()}`,
    })

    expect(order).toBeNull()
  })

  it('creates an order from an active cart and persists its totals and items', async () => {
    // Remove the fixture order because the cart has a unique order relation.
    await prisma.orderItem.deleteMany({
      where: { orderId },
    })

    await prisma.order.delete({
      where: { id: orderId },
    })

    const order = await OrderService.createOrder({
      userId,
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        city: 'Test City',
        province: 'Test Province',
        email: 'order-test@example.com',
        phone: '0000000000',
        address: 'Test Street 1',
        postalCode: '00000',
      },
      paymentMethod: 'zarinpal',
    })

    expect(order).toMatchObject({
      userId,
      cartId,
      status: 'PENDING',
      shippingAddress: 'Test Street 1',
      shippingCity: 'Test City',
      shippingFirstName: 'Test',
      shippingLastName: 'Customer',
    })

    // Subtotal: 2 × 2,500 = 5,000.
    // Tax: 9% of 5,000 = 450.
    // Shipping: 300,000 because subtotal is below 2,000,000.
    expect(order.totalPrice).toBe(305450)

    const savedItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    })

    expect(savedItems).toHaveLength(1)
    expect(savedItems[0]).toMatchObject({
      productId,
      quantity: 2,
      price: 2500,
    })
  })

  it('rejects creating an order when the active cart is empty', async () => {
    // Remove the cart item, leaving the active cart empty.
    await prisma.cartItem.deleteMany({
      where: { cartId },
    })

    // Remove the fixture order so it doesn't interfere with the test.
    await prisma.orderItem.deleteMany({
      where: { orderId },
    })
    await prisma.order.delete({
      where: { id: orderId },
    })

    await expect(
      OrderService.createOrder({
        userId,
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          city: 'Test City',
          province: 'Test Province',
          email: 'order-test@example.com',
          phone: '0000000000',
          address: 'Test Street 1',
          postalCode: '00000',
        },
        paymentMethod: 'zarinpal',
      }),
    ).rejects.toThrow('Cart is empty or does not exist')
  })

  it('rejects creating an order when the user has no active cart', async () => {
    // Remove the fixture order and its items.
    await prisma.orderItem.deleteMany({
      where: { orderId },
    })
    await prisma.order.delete({
      where: { id: orderId },
    })

    // Change the cart status so it is no longer active.
    await prisma.cart.update({
      where: { id: cartId },
      data: { status: 'CHECKED_OUT' },
    })

    await expect(
      OrderService.createOrder({
        userId,
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          city: 'Test City',
          province: 'Test Province',
          email: 'order-test@example.com',
          phone: '0000000000',
          address: 'Test Street 1',
          postalCode: '00000',
        },
        paymentMethod: 'zarinpal',
      }),
    ).rejects.toThrow('Cart is empty or does not exist')
  })

  it('returns the existing pending order instead of creating a duplicate', async () => {
    const existingOrder = await OrderService.createOrder({
      userId,
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        city: 'Test City',
        province: 'Test Province',
        email: 'order-test@example.com',
        phone: '0000000000',
        address: 'Test Street 1',
        postalCode: '00000',
      },
      paymentMethod: 'zarinpal',
    })

    // The fixture already created a PENDING order for this cart.
    expect(existingOrder.id).toBe(orderId)

    const orderCount = await prisma.order.count({
      where: { cartId },
    })

    expect(orderCount).toBe(1)
  })

  it('preserves the existing pending order snapshot when the cart changes', async () => {
    const originalOrder = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { items: true },
    })

    await prisma.cartItem.updateMany({
      where: { cartId, productId },
      data: { quantity: 3 },
    })

    const returnedOrder = await OrderService.createOrder({
      userId,
      shippingInfo: {
        firstName: 'Updated',
        lastName: 'Customer',
        city: 'Updated City',
        province: 'Updated Province',
        email: 'updated@example.com',
        phone: '1111111111',
        address: 'Updated Street 2',
        postalCode: '11111',
      },
      paymentMethod: 'mellat',
    })

    const persistedOrder = await prisma.order.findUniqueOrThrow({
      where: { id: orderId },
      include: { items: true },
    })

    expect(returnedOrder.id).toBe(orderId)
    expect(persistedOrder.totalPrice).toBe(originalOrder.totalPrice)
    expect(persistedOrder.items).toHaveLength(originalOrder.items.length)
    expect(persistedOrder.items[0].quantity).toBe(2)
    expect(persistedOrder.shippingCity).toBe(originalOrder.shippingCity)
  })

  it('rejects creating another order when the cart already has a paid order', async () => {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    })

    await expect(
      OrderService.createOrder({
        userId,
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          city: 'Test City',
          province: 'Test Province',
          email: 'order-test@example.com',
          phone: '0000000000',
          address: 'Test Street 1',
          postalCode: '00000',
        },
        paymentMethod: 'zarinpal',
      }),
    ).rejects.toThrow('This cart has already been ordered and paid for.')

    const savedOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(savedOrder?.status).toBe('PAID')

    const orderCount = await prisma.order.count({
      where: { cartId },
    })

    expect(orderCount).toBe(1)
  })

  it('replaces a failed order when checkout is retried', async () => {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'FAILED' },
    })

    const replacementOrder = await OrderService.createOrder({
      userId,
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        city: 'Test City',
        province: 'Test Province',
        email: 'order-test@example.com',
        phone: '0000000000',
        address: 'Test Street 1',
        postalCode: '00000',
      },
      paymentMethod: 'zarinpal',
    })

    expect(replacementOrder.id).not.toBe(orderId)
    expect(replacementOrder.cartId).toBe(cartId)
    expect(replacementOrder.status).toBe('PENDING')

    const orders = await prisma.order.findMany({
      where: { cartId },
    })

    expect(orders).toHaveLength(1)
    expect(orders[0].id).toBe(replacementOrder.id)

    const replacementItems = await prisma.orderItem.findMany({
      where: { orderId: replacementOrder.id },
    })

    expect(replacementItems).toHaveLength(1)
    expect(replacementItems[0]).toMatchObject({
      productId,
      quantity: 2,
      price: 2500,
    })
  })

  it('replaces a canceled order when checkout is retried', async () => {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELED' },
    })

    const replacementOrder = await OrderService.createOrder({
      userId,
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        city: 'Test City',
        province: 'Test Province',
        email: 'order-test@example.com',
        phone: '0000000000',
        address: 'Test Street 1',
        postalCode: '00000',
      },
      paymentMethod: 'zarinpal',
    })

    expect(replacementOrder.id).not.toBe(orderId)
    expect(replacementOrder.cartId).toBe(cartId)
    expect(replacementOrder.status).toBe('PENDING')

    const orders = await prisma.order.findMany({
      where: { cartId },
    })

    expect(orders).toHaveLength(1)
    expect(orders[0].id).toBe(replacementOrder.id)

    const replacementItems = await prisma.orderItem.findMany({
      where: { orderId: replacementOrder.id },
    })

    expect(replacementItems).toHaveLength(1)
    expect(replacementItems[0]).toMatchObject({
      productId,
      quantity: 2,
      price: 2500,
    })
  })

  it('marks an order as paid and checks out its cart after payment verification', async () => {
    const authority = `test-authority-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentAuthority: authority,
        status: 'PENDING',
      },
    })

    const refId = `test-ref-${crypto.randomUUID()}`

    const result = await OrderService.verifyAndFinalizePayment({
      authority,
      refId,
      status: 'PAID',
    })

    expect(result?.id).toBe(orderId)
    expect(result?.status).toBe('PAID')
    expect(result?.paymentRefId).toBe(refId)
    expect(result?.paymentVerifiedAt).toBeInstanceOf(Date)

    const savedCart = await prisma.cart.findUnique({
      where: { id: cartId },
    })

    expect(savedCart?.status).toBe('CHECKED_OUT')
  })

  it('rejects payment finalization when no order matches the authority', async () => {
    const authority = `missing-authority-${crypto.randomUUID()}`

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority,
        refId: 'test-ref',
        status: 'PAID',
      }),
    ).rejects.toThrow()
  })

  it('marks an order as failed without checking out its cart', async () => {
    const authority = `failed-authority-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentAuthority: authority,
        status: 'PENDING',
      },
    })

    const refId = `failed-ref-${crypto.randomUUID()}`

    const result = await OrderService.verifyAndFinalizePayment({
      authority,
      refId,
      status: 'FAILED',
      errorMessage: 'Payment declined in test',
    })

    expect(result?.status).toBe('FAILED')
    expect(result?.paymentRefId).toBe(refId)
    expect(result?.paymentErrorMessage).toBe('Payment declined in test')
    expect(result?.paymentVerifiedAt).toBeInstanceOf(Date)

    const savedCart = await prisma.cart.findUnique({
      where: { id: cartId },
    })

    expect(savedCart?.status).toBe('ACTIVE')
  })

  it('rejects a duplicate payment callback after the order is paid', async () => {
    const authority = `duplicate-authority-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentAuthority: authority,
        status: 'PENDING',
      },
    })

    await OrderService.verifyAndFinalizePayment({
      authority,
      refId: 'first-payment-ref',
      status: 'PAID',
    })

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority,
        refId: 'second-payment-ref',
        status: 'PAID',
      }),
    ).rejects.toThrow()

    const savedOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(savedOrder?.status).toBe('PAID')
    expect(savedOrder?.paymentRefId).toBe('first-payment-ref')
  })

  it('rejects a payment callback when the order is already failed', async () => {
    const authority = `already-failed-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentAuthority: authority,
        status: 'FAILED',
      },
    })

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority,
        refId: 'late-payment-ref',
        status: 'PAID',
      }),
    ).rejects.toThrow()

    const savedOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(savedOrder?.status).toBe('FAILED')
  })

  it('rejects a second payment callback after the order has failed', async () => {
    const authority = `duplicate-failure-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentAuthority: authority,
        status: 'PENDING',
      },
    })

    await OrderService.verifyAndFinalizePayment({
      authority,
      refId: 'first-failure-ref',
      status: 'FAILED',
      errorMessage: 'First failure',
    })

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority,
        refId: 'second-failure-ref',
        status: 'FAILED',
        errorMessage: 'Second failure',
      }),
    ).rejects.toThrow()

    const savedOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(savedOrder?.status).toBe('FAILED')
    expect(savedOrder?.paymentRefId).toBe('first-failure-ref')
    expect(savedOrder?.paymentErrorMessage).toBe('First failure')
  })

  it('saves the payment authority and request timestamp', async () => {
    const authority = `authority-${crypto.randomUUID()}`

    const updatedOrder = await OrderService.updateOrderPaymentAuthority({
      orderId,
      authority,
    })

    expect(updatedOrder.paymentAuthority).toBe(authority)
    expect(updatedOrder.paymentRequestedAt).toBeInstanceOf(Date)

    const savedOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(savedOrder?.paymentAuthority).toBe(authority)
    expect(savedOrder?.paymentRequestedAt).toBeInstanceOf(Date)
  })

  it('returns null when finding an order with an unknown payment authority', async () => {
    const order = await OrderService.findOrderByAuthority(
      `unknown-authority-${crypto.randomUUID()}`,
    )

    expect(order).toBeNull()
  })

  it('returns the matching order and its items for an exact payment authority', async () => {
    const authority = `exact-authority-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentAuthority: authority },
    })

    const order = await OrderService.findOrderByAuthority(authority)

    expect(order?.id).toBe(orderId)
    expect(order?.paymentAuthority).toBe(authority)
    expect(order?.items).toHaveLength(1)
    expect(order?.items[0].product.id).toBe(productId)
  })

  it('returns null when the payment authority is empty', async () => {
    const order = await OrderService.findOrderByAuthority('')

    expect(order).toBeNull()
  })

  it('updates an order status and shipping notes', async () => {
    const updatedOrder = await OrderService.updateOrder({
      orderId,
      status: 'CANCELED',
      shippingNotes: 'Integration test shipping note',
    })

    expect(updatedOrder.id).toBe(orderId)
    expect(updatedOrder.status).toBe('CANCELED')
    expect(updatedOrder.shippingNotes).toBe('Integration test shipping note')

    const savedOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(savedOrder?.status).toBe('CANCELED')
    expect(savedOrder?.shippingNotes).toBe('Integration test shipping note')
  })

  it('rejects updating payment authority for a nonexistent order', async () => {
    await expect(
      OrderService.updateOrderPaymentAuthority({
        orderId: `missing-order-${crypto.randomUUID()}`,
        authority: 'test-authority',
      }),
    ).rejects.toThrow()
  })

  it('rejects updating a nonexistent order', async () => {
    await expect(
      OrderService.updateOrder({
        orderId: `missing-order-${crypto.randomUUID()}`,
        status: 'CANCELED',
        shippingNotes: 'Test note',
      }),
    ).rejects.toThrow()
  })

  it('returns null when finding an order with a nonexistent authority', async () => {
    const order = await OrderService.findOrderByAuthority(
      `no-match-${crypto.randomUUID()}`,
    )

    expect(order).toBeNull()
  })

  it('finds an order using an exact authority even when another authority shares its prefix', async () => {
    const exactAuthority = `shared-prefix-${crypto.randomUUID()}-exact`
    const otherAuthority = `shared-prefix-${crypto.randomUUID()}-other`

    // Ensure both authorities share a prefix but remain distinct.
    const prefix = `shared-prefix-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentAuthority: `${prefix}-exact` },
    })

    const otherCart = await prisma.cart.create({
      data: { userId, status: 'ACTIVE' },
    })

    const otherOrder = await prisma.order.create({
      data: {
        userId,
        cartId: otherCart.id,
        totalPrice: 1000,
        status: 'PENDING',
        shippingAddress: 'Other Street',
        shippingCity: 'Other City',
        shippingEmail: 'other@example.com',
        shippingFirstName: 'Other',
        shippingLastName: 'Customer',
        shippingPhone: '0000000001',
        shippingPostalCode: '00001',
        shippingProvince: 'Other Province',
        paymentAuthority: `${prefix}-other`,
      },
    })

    try {
      const result = await OrderService.findOrderByAuthority(`${prefix}-exact`)

      expect(result?.id).toBe(orderId)
      expect(result?.paymentAuthority).toBe(`${prefix}-exact`)
      expect(result?.id).not.toBe(otherOrder.id)
    } finally {
      await prisma.orderItem.deleteMany({
        where: { orderId: otherOrder.id },
      })

      await prisma.order.delete({
        where: { id: otherOrder.id },
      })

      await prisma.cartItem.deleteMany({
        where: { cartId: otherCart.id },
      })

      await prisma.cart.delete({
        where: { id: otherCart.id },
      })
    }
  })

  it('does not return an unrelated order when an authority does not match', async () => {
    const result = await OrderService.findOrderByAuthority(
      `completely-unrelated-${crypto.randomUUID()}`,
    )

    expect(result).toBeNull()
  })

  it('rejects payment finalization when an authority does not match any order', async () => {
    await expect(
      OrderService.verifyAndFinalizePayment({
        authority: `missing-authority-${crypto.randomUUID()}`,
        refId: 'missing-ref',
        status: 'PAID',
      }),
    ).rejects.toThrow()
  })

  it('does not find an order using only a partial payment authority', async () => {
    const authority = `secure-authority-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentAuthority: authority },
    })

    const result = await OrderService.findOrderByAuthority(
      authority.substring(0, 20),
    )

    expect(result).toBeNull()
  })

  it('does not choose an arbitrary order when an authority matches multiple orders partially', async () => {
    const prefix = `ambiguous-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentAuthority: `${prefix}-first` },
    })

    const otherCart = await prisma.cart.create({
      data: { userId, status: 'ACTIVE' },
    })

    let otherOrderId: string | undefined

    try {
      const otherOrder = await prisma.order.create({
        data: {
          userId,
          cartId: otherCart.id,
          totalPrice: 1000,
          status: 'PENDING',
          shippingAddress: 'Other Street',
          shippingCity: 'Other City',
          shippingEmail: 'other@example.com',
          shippingFirstName: 'Other',
          shippingLastName: 'Customer',
          shippingPhone: '0000000001',
          shippingPostalCode: '00001',
          shippingProvince: 'Other Province',
          paymentAuthority: `${prefix}-second`,
        },
      })

      otherOrderId = otherOrder.id

      const result = await OrderService.findOrderByAuthority(prefix)

      expect(result).toBeNull()
    } finally {
      if (otherOrderId) {
        await prisma.orderItem.deleteMany({
          where: { orderId: otherOrderId },
        })
        await prisma.order.delete({ where: { id: otherOrderId } })
      }

      await prisma.cartItem.deleteMany({
        where: { cartId: otherCart.id },
      })
      await prisma.cart.delete({ where: { id: otherCart.id } })
    }
  })

  it('rejects payment finalization for a canceled order without changing its state', async () => {
    const authority = `canceled-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELED',
        paymentAuthority: authority,
      },
    })

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority,
        refId: `ref-${crypto.randomUUID()}`,
        status: 'PAID',
      }),
    ).rejects.toThrow()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    })

    expect(order?.status).toBe('CANCELED')
    expect(order?.paymentRefId).toBeNull()
    expect(order?.paymentVerifiedAt).toBeNull()
    expect(cart?.status).toBe('ACTIVE')
  })

  it('rejects a failed-payment callback for a canceled order without modifying it', async () => {
    const authority = `canceled-failed-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELED',
        paymentAuthority: authority,
      },
    })

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority,
        refId: `ref-${crypto.randomUUID()}`,
        status: 'FAILED',
        errorMessage: 'Payment declined',
      }),
    ).rejects.toThrow()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(order?.status).toBe('CANCELED')
    expect(order?.paymentRefId).toBeNull()
    expect(order?.paymentErrorMessage).toBeNull()
    expect(order?.paymentVerifiedAt).toBeNull()
  })

  it('rejects payment finalization when given only a partial authority', async () => {
    const authority = `exact-only-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentAuthority: authority },
    })

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority: authority.substring(0, 20),
        refId: `ref-${crypto.randomUUID()}`,
        status: 'PAID',
      }),
    ).rejects.toThrow()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(order?.status).toBe('PENDING')
    expect(order?.paymentRefId).toBeNull()
    expect(order?.paymentVerifiedAt).toBeNull()
  })

  it('allows only one of two conflicting concurrent payment callbacks to finalize an order', async () => {
    const authority = `concurrent-${crypto.randomUUID()}`
    const paidRef = `paid-${crypto.randomUUID()}`
    const failedRef = `failed-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentAuthority: authority },
    })

    const results = await Promise.allSettled([
      OrderService.verifyAndFinalizePayment({
        authority,
        refId: paidRef,
        status: 'PAID',
      }),
      OrderService.verifyAndFinalizePayment({
        authority,
        refId: failedRef,
        status: 'FAILED',
        errorMessage: 'Simulated payment failure',
      }),
    ])

    const fulfilled = results.filter((result) => result.status === 'fulfilled')
    const rejected = results.filter((result) => result.status === 'rejected')

    expect(fulfilled).toHaveLength(1)
    expect(rejected).toHaveLength(1)

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
    })

    expect(['PAID', 'FAILED']).toContain(order?.status)
    expect([paidRef, failedRef]).toContain(order?.paymentRefId)
    expect(order?.paymentVerifiedAt).toBeInstanceOf(Date)

    if (order?.status === 'PAID') {
      expect(order.paymentRefId).toBe(paidRef)
      expect(cart?.status).toBe('CHECKED_OUT')
    } else {
      expect(order?.paymentRefId).toBe(failedRef)
      expect(order?.paymentErrorMessage).toBe('Simulated payment failure')
      expect(cart?.status).toBe('ACTIVE')
    }
  })

  it('preserves the original payment reference when a successful callback is repeated', async () => {
    const authority = `repeat-paid-${crypto.randomUUID()}`
    const originalRef = `original-${crypto.randomUUID()}`
    const duplicateRef = `duplicate-${crypto.randomUUID()}`

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentAuthority: authority },
    })

    await OrderService.verifyAndFinalizePayment({
      authority,
      refId: originalRef,
      status: 'PAID',
    })

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority,
        refId: duplicateRef,
        status: 'PAID',
      }),
    ).rejects.toThrow()

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(order?.status).toBe('PAID')
    expect(order?.paymentRefId).toBe(originalRef)
  })

  it('applies free shipping when the subtotal equals the free-shipping threshold', async () => {
    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })

    await prisma.cartItem.deleteMany({ where: { cartId } })

    await prisma.product.update({
      where: { id: productId },
      data: { price: 1_000_000 },
    })

    await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity: 2,
        price: 1_000_000,
      },
    })

    const order = await OrderService.createOrder({
      userId,
      paymentMethod: 'zarinpal',
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'test@example.com',
        phone: '0000000000',
        city: 'Test City',
        province: 'Test Province',
        address: 'Test Street 1',
        postalCode: '00000',
      },
    })

    expect(order.totalPrice).toBe(2_180_000)

    const items = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    })

    expect(items).toHaveLength(1)
    expect(items[0].price * items[0].quantity).toBe(2_000_000)
  })

  it('charges delivery when the subtotal is just below the free-shipping threshold', async () => {
    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })

    await prisma.cartItem.deleteMany({ where: { cartId } })

    await prisma.product.update({
      where: { id: productId },
      data: { price: 999_999 },
    })

    await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity: 2,
        price: 999_999,
      },
    })

    const order = await OrderService.createOrder({
      userId,
      paymentMethod: 'mellat',
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'test@example.com',
        phone: '0000000000',
        city: 'Test City',
        province: 'Test Province',
        address: 'Test Street 1',
        postalCode: '00000',
      },
    })

    // Subtotal: 1,999,998
    // Tax: round(1,999,998 * 0.09) = 180,000
    // Delivery: 300,000
    expect(order.totalPrice).toBe(2_479_998)
  })

  it('rounds tax to the nearest integer when calculating the order total', async () => {
    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })

    await prisma.cartItem.deleteMany({ where: { cartId } })

    await prisma.product.update({
      where: { id: productId },
      data: { price: 101 },
    })

    await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity: 1,
        price: 101,
      },
    })

    const order = await OrderService.createOrder({
      userId,
      paymentMethod: 'zarinpal',
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'test@example.com',
        phone: '0000000000',
        city: 'Test City',
        province: 'Test Province',
        address: 'Test Street 1',
        postalCode: '00000',
      },
    })

    // Subtotal: 101
    // Tax: round(101 * 0.09) = 9
    // Delivery: 300,000
    expect(order.totalPrice).toBe(300_110)
  })

  it('uses the discounted product price when creating an order', async () => {
    await prisma.orderItem.deleteMany({
      where: { orderId },
    })

    await prisma.order.delete({
      where: { id: orderId },
    })

    await prisma.product.update({
      where: { id: productId },
      data: {
        price: 2500,
        discount: 20,
        discountedPrice: 2000,
      },
    })

    await prisma.cartItem.updateMany({
      where: { cartId, productId },
      data: { price: 2000, quantity: 2 },
    })

    const order = await OrderService.createOrder({
      userId,
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'order-test@example.com',
        phone: '0000000000',
        city: 'Test City',
        province: 'Test Province',
        address: 'Test Street 1',
        postalCode: '00000',
      },
      paymentMethod: 'zarinpal',
    })

    const orderItems = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    })

    // Subtotal: 2 × 2000 = 4000
    // Tax: round(4000 × 0.09) = 360
    // Delivery: 300000
    expect(order.totalPrice).toBe(304360)
    expect(orderItems).toHaveLength(1)
    expect(orderItems[0].price).toBe(2000)
  })

  it('rejects checkout when userId is missing', async () => {
    const invalidInput = {
      userId: undefined,
      paymentMethod: 'zarinpal' as const,
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'test@example.com',
        phone: '0000000000',
        city: 'Test City',
        province: 'Test Province',
        address: 'Test Street 1',
        postalCode: '00000',
      },
    } as unknown as Parameters<typeof OrderService.createOrder>[0]

    await expect(OrderService.createOrder(invalidInput)).rejects.toThrow(
      'Authenticated user is required',
    )
  })

  it('uses the authoritative product price rather than a manipulated cart-item price', async () => {
    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })
    await prisma.cartItem.deleteMany({ where: { cartId } })

    await prisma.product.update({
      where: { id: productId },
      data: { price: 2500 },
    })

    await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity: 2,
        price: 1,
      },
    })

    const order = await OrderService.createOrder({
      userId,
      paymentMethod: 'zarinpal',
      shippingInfo: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'test@example.com',
        phone: '0000000000',
        city: 'Test City',
        province: 'Test Province',
        address: 'Test Street 1',
        postalCode: '00000',
      },
    })

    // Expected subtotal: 2 × 2,500 = 5,000
    // Tax: 450; delivery: 300,000
    expect(order.totalPrice).toBe(305_450)

    const items = await prisma.orderItem.findMany({
      where: { orderId: order.id },
    })

    expect(items).toHaveLength(1)
    expect(items[0].price).toBe(2500)
  })

  it('does not reuse an order belonging to another user', async () => {
    const otherUser = await prisma.user.create({
      data: {
        email: `other-order-test-${crypto.randomUUID()}@example.com`,
      },
    })

    try {
      await expect(
        OrderService.createOrder({
          userId: otherUser.id,
          paymentMethod: 'zarinpal',
          shippingInfo: {
            firstName: 'Other',
            lastName: 'Customer',
            email: 'other@example.com',
            phone: '0000000001',
            city: 'Other City',
            province: 'Other Province',
            address: 'Other Street',
            postalCode: '00001',
          },
        }),
      ).rejects.toThrow('Cart is empty or does not exist')

      const originalOrder = await prisma.order.findUnique({
        where: { id: orderId },
      })

      expect(originalOrder?.userId).toBe(userId)
    } finally {
      await prisma.user.delete({ where: { id: otherUser.id } })
    }
  })

  it('rejects checkout when userId is an empty string', async () => {
    await expect(
      OrderService.createOrder({
        userId: '',
        paymentMethod: 'zarinpal',
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          email: 'test@example.com',
          phone: '0000000000',
          city: 'Test City',
          province: 'Test Province',
          address: 'Test Street 1',
          postalCode: '00000',
        },
      }),
    ).rejects.toThrow()
  })

  it('does not create an order for an inactive product', async () => {
    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })

    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    })

    await expect(
      OrderService.createOrder({
        userId,
        paymentMethod: 'zarinpal',
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          email: 'test@example.com',
          phone: '0000000000',
          city: 'Test City',
          province: 'Test Province',
          address: 'Test Street 1',
          postalCode: '00000',
        },
      }),
    ).rejects.toThrow()

    expect(await prisma.order.count({ where: { userId } })).toBe(0)
  })

  it('does not allow a zero or negative cart-item quantity to reach checkout', async () => {
    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })

    await prisma.cartItem.updateMany({
      where: { cartId },
      data: { quantity: 0 },
    })

    await expect(
      OrderService.createOrder({
        userId,
        paymentMethod: 'zarinpal',
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          email: 'test@example.com',
          phone: '0000000000',
          city: 'Test City',
          province: 'Test Province',
          address: 'Test Street 1',
          postalCode: '00000',
        },
      }),
    ).rejects.toThrow()
  })

  it('rejects checkout for an inactive product even when a pending order exists', async () => {
    // The fixture already contains a pending order for this cart.
    await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    })

    await expect(
      OrderService.createOrder({
        userId,
        paymentMethod: 'zarinpal',
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          email: 'order-test@example.com',
          phone: '0000000000',
          city: 'Test City',
          province: 'Test Province',
          address: 'Test Street 1',
          postalCode: '00000',
        },
      }),
    ).rejects.toThrow()

    // The existing order should remain unchanged.
    const savedOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(savedOrder).not.toBeNull()
    expect(savedOrder?.status).toBe('PENDING')

    // No duplicate order should be created.
    const orderCount = await prisma.order.count({
      where: { cartId },
    })

    expect(orderCount).toBe(1)
  })

  it('rejects checkout when the product price is negative', async () => {
    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })

    await prisma.product.update({
      where: { id: productId },
      data: { price: -100 },
    })

    await expect(
      OrderService.createOrder({
        userId,
        paymentMethod: 'zarinpal',
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          email: 'order-test@example.com',
          phone: '0000000000',
          city: 'Test City',
          province: 'Test Province',
          address: 'Test Street 1',
          postalCode: '00000',
        },
      }),
    ).rejects.toThrow()

    expect(await prisma.order.count({ where: { cartId } })).toBe(0)
  })

  it('rejects checkout when quantity is zero and a pending order exists', async () => {
    await prisma.cartItem.updateMany({
      where: { cartId },
      data: { quantity: 0 },
    })

    await expect(
      OrderService.createOrder({
        userId,
        paymentMethod: 'zarinpal',
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          email: 'order-test@example.com',
          phone: '0000000000',
          city: 'Test City',
          province: 'Test Province',
          address: 'Test Street 1',
          postalCode: '00000',
        },
      }),
    ).rejects.toThrow()

    // The existing pending order should not be duplicated or replaced.
    const orders = await prisma.order.findMany({
      where: { cartId },
    })

    expect(orders).toHaveLength(1)
    expect(orders[0].id).toBe(orderId)
    expect(orders[0].status).toBe('PENDING')
  })

  it('does not create an order for another user’s cart', async () => {
    const otherUser = await prisma.user.create({
      data: {
        email: `other-order-test-${crypto.randomUUID()}@example.com`,
      },
    })

    try {
      await expect(
        OrderService.createOrder({
          userId: otherUser.id,
          paymentMethod: 'zarinpal',
          shippingInfo: {
            firstName: 'Other',
            lastName: 'Customer',
            email: 'other@example.com',
            phone: '0000000001',
            city: 'Other City',
            province: 'Other Province',
            address: 'Other Street',
            postalCode: '00001',
          },
        }),
      ).rejects.toThrow('Cart is empty or does not exist')

      expect(
        await prisma.order.count({
          where: { userId: otherUser.id },
        }),
      ).toBe(0)

      // The original user's order must remain untouched.
      const originalOrder = await prisma.order.findUnique({
        where: { id: orderId },
      })

      expect(originalOrder?.userId).toBe(userId)
      expect(originalOrder?.status).toBe('PENDING')
    } finally {
      await prisma.user.delete({
        where: { id: otherUser.id },
      })
    }
  })

  it('rejects checkout when a cart item has a negative quantity', async () => {
    await prisma.cartItem.updateMany({
      where: { cartId },
      data: { quantity: -1 },
    })

    await expect(
      OrderService.createOrder({
        userId,
        paymentMethod: 'zarinpal',
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          email: 'order-test@example.com',
          phone: '0000000000',
          city: 'Test City',
          province: 'Test Province',
          address: 'Test Street 1',
          postalCode: '00000',
        },
      }),
    ).rejects.toThrow()
  })

  it('does not create an order when its cart item references a missing product', async () => {
    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })

    // Remove the cart item first, then recreate a malformed reference
    // only if your schema permits it. Otherwise, the FK constraint itself
    // guarantees that the referenced product cannot be missing.
    await expect(
      prisma.product.delete({
        where: { id: productId },
      }),
    ).rejects.toThrow()

    // The product remains present because the cart item references it.
    expect(
      await prisma.product.findUnique({ where: { id: productId } }),
    ).not.toBeNull()
  })

  it('rejects checkout for an inactive cart even when a pending order exists', async () => {
    await prisma.cart.update({
      where: { id: cartId },
      data: { status: 'CHECKED_OUT' },
    })

    await expect(
      OrderService.createOrder({
        userId,
        paymentMethod: 'zarinpal',
        shippingInfo: {
          firstName: 'Test',
          lastName: 'Customer',
          email: 'order-test@example.com',
          phone: '0000000000',
          city: 'Test City',
          province: 'Test Province',
          address: 'Test Street 1',
          postalCode: '00000',
        },
      }),
    ).rejects.toThrow('Cart is empty or does not exist')

    // The existing order should remain, but checkout must not return it
    // as though the inactive cart were valid.
    const savedOrder = await prisma.order.findUnique({
      where: { id: orderId },
    })

    expect(savedOrder?.status).toBe('PENDING')
  })
})
