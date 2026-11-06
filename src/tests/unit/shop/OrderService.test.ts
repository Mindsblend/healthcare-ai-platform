import { OrderService } from '@/features/shop/services/OrderService'
import { prisma } from '@/lib/prisma'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    cart: {
      findFirst: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

describe('OrderService.fetchOrdersPreview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns order previews', async () => {
    const orders = [
      {
        id: 'order-1',
        totalPrice: 1500000,
        shippingFirstName: 'Ashkan',
        shippingLastName: 'Test',
        shippingPhone: '09120000000',
        createdAt: new Date('2026-10-05'),
        status: 'PENDING',
      },
      {
        id: 'order-2',
        totalPrice: 2500000,
        shippingFirstName: 'John',
        shippingLastName: 'Doe',
        shippingPhone: '09121111111',
        createdAt: new Date('2026-10-04'),
        status: 'PAID',
      },
    ]

    vi.mocked(prisma.order.findMany).mockResolvedValueOnce(orders as never)

    const result = await OrderService.fetchOrdersPreview()

    expect(result).toEqual(orders)

    expect(prisma.order.findMany).toHaveBeenCalledWith({
      select: {
        id: true,
        totalPrice: true,
        shippingFirstName: true,
        shippingLastName: true,
        shippingPhone: true,
        createdAt: true,
        status: true,
      },
    })
  })
})

describe('OrderService.fetchOrderById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns an order with its items and product details', async () => {
    const order = {
      id: 'order-123',
      totalPrice: 1500000,
      status: 'PENDING',
      items: [
        {
          id: 'item-1',
          productId: 'product-1',
          quantity: 2,
          price: 500000,
          product: {
            id: 'product-1',
            title: 'Test Product',
            price: 550000,
            image: '/product.jpg',
            slug: 'test-product',
          },
        },
      ],
    }

    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(order as never)

    const result = await OrderService.fetchOrderById({
      id: 'order-123',
    })

    expect(result).toEqual(order)

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'order-123',
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                image: true,
                slug: true,
              },
            },
          },
        },
      },
    })
  })
})

describe('OrderService.createOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws when the user has no active cart', async () => {
    vi.mocked(prisma.cart.findFirst).mockResolvedValueOnce(null)

    await expect(
      OrderService.createOrder({
        userId: 'user-123',
        shippingInfo: {
          firstName: 'Ashkan',
          lastName: 'Test',
          email: 'test@example.com',
          phone: '09120000000',
          city: 'Tehran',
          province: 'Tehran',
          address: 'Test address',
          postalCode: '1234567890',
          notes: '',
        },
        paymentMethod: 'zarinpal',
      }),
    ).rejects.toThrow('Cart is empty or does not exist')

    expect(prisma.cart.findFirst).toHaveBeenCalledWith({
      where: {
        userId: 'user-123',
        status: 'ACTIVE',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  })

  it('throws when the active cart is empty', async () => {
    const cart = {
      id: 'cart-123',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [],
    }

    vi.mocked(prisma.cart.findFirst).mockResolvedValueOnce(cart as never)

    await expect(
      OrderService.createOrder({
        userId: 'user-123',
        shippingInfo: {
          firstName: 'Ashkan',
          lastName: 'Test',
          email: 'test@example.com',
          phone: '09120000000',
          city: 'Tehran',
          province: 'Tehran',
          address: 'Test address',
          postalCode: '1234567890',
          notes: '',
        },
        paymentMethod: 'zarinpal',
      }),
    ).rejects.toThrow('Cart is empty or does not exist')

    expect(prisma.cart.findFirst).toHaveBeenCalledTimes(1)
  })

  it('throws when the cart already has a PAID order', async () => {
    const cart = {
      id: 'cart-123',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          productId: 'product-1',
          quantity: 1,
          price: 500000,
          product: {
            id: 'product-1',
            isActive: true,
            price: 500000,
          },
        },
      ],
    }

    const existingOrder = {
      id: 'order-123',
      cartId: 'cart-123',
      status: 'PAID',
    }

    vi.mocked(prisma.cart.findFirst).mockResolvedValueOnce(cart as never)
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(
      existingOrder as never,
    )

    await expect(
      OrderService.createOrder({
        userId: 'user-123',
        shippingInfo: {
          firstName: 'Ashkan',
          lastName: 'Test',
          email: 'test@example.com',
          phone: '09120000000',
          city: 'Tehran',
          province: 'Tehran',
          address: 'Test address',
          postalCode: '1234567890',
          notes: '',
        },
        paymentMethod: 'zarinpal',
      }),
    ).rejects.toThrow('This cart has already been ordered and paid for.')

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: {
        cartId: 'cart-123',
      },
    })
  })

  it('returns the existing PENDING order instead of creating another order', async () => {
    const cart = {
      id: 'cart-123',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          productId: 'product-1',
          quantity: 1,
          price: 500000,
          product: {
            id: 'product-1',
            isActive: true,
            price: 500000,
          },
        },
      ],
    }

    const existingOrder = {
      id: 'order-123',
      cartId: 'cart-123',
      status: 'PENDING',
      totalPrice: 845000,
    }

    vi.mocked(prisma.cart.findFirst).mockResolvedValueOnce(cart as never)
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(
      existingOrder as never,
    )

    const result = await OrderService.createOrder({
      userId: 'user-123',
      shippingInfo: {
        firstName: 'Ashkan',
        lastName: 'Test',
        email: 'test@example.com',
        phone: '09120000000',
        city: 'Tehran',
        province: 'Tehran',
        address: 'Test address',
        postalCode: '1234567890',
        notes: '',
      },
      paymentMethod: 'zarinpal',
    })

    expect(result).toBe(existingOrder)
  })

  it('deletes a FAILED order and creates a new PENDING order', async () => {
    const cart = {
      id: 'cart-123',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          productId: 'product-1',
          quantity: 2,
          price: 500000,
          product: {
            id: 'product-1',
            isActive: true,
            price: 500000,
          },
        },
      ],
    }

    const existingOrder = {
      id: 'order-old',
      cartId: 'cart-123',
      status: 'FAILED',
    }

    const newOrder = {
      id: 'order-new',
      cartId: 'cart-123',
      status: 'PENDING',
      totalPrice: 1390000,
    }

    const orderItemDeleteMany = vi.fn()
    const orderDelete = vi.fn()

    vi.mocked(prisma.cart.findFirst).mockResolvedValueOnce(cart as never)
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(
      existingOrder as never,
    )

    vi.mocked(prisma.$transaction)
      .mockImplementationOnce(async (callback: any) =>
        callback({
          orderItem: {
            deleteMany: orderItemDeleteMany,
          },
          order: {
            delete: orderDelete,
          },
        } as never),
      )
      .mockImplementationOnce(async (callback: any) =>
        callback({
          order: {
            create: vi.fn().mockResolvedValue(newOrder),
          },
        } as never),
      )

    const result = await OrderService.createOrder({
      userId: 'user-123',
      shippingInfo: {
        firstName: 'Ashkan',
        lastName: 'Test',
        email: 'test@example.com',
        phone: '09120000000',
        city: 'Tehran',
        province: 'Tehran',
        address: 'Test address',
        postalCode: '1234567890',
        notes: '',
      },
      paymentMethod: 'zarinpal',
    })

    expect(orderItemDeleteMany).toHaveBeenCalledWith({
      where: {
        orderId: 'order-old',
      },
    })

    expect(orderDelete).toHaveBeenCalledWith({
      where: {
        id: 'order-old',
      },
    })

    expect(result).toEqual(newOrder)
  })

  it('creates a PENDING order with the correct totals and cart item snapshot', async () => {
    const cart = {
      id: 'cart-123',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          productId: 'product-1',
          quantity: 2,
          price: 500000,
          product: {
            id: 'product-1',
            title: 'Test Product',
            isActive: true,
            price: 500000,
          },
        },
        {
          id: 'item-2',
          productId: 'product-2',
          quantity: 1,
          price: 300000,
          product: {
            id: 'product-2',
            title: 'Another Product',
            isActive: true,
            price: 300000,
          },
        },
      ],
    }

    const createdOrder = {
      id: 'order-123',
      cartId: 'cart-123',
      userId: 'user-123',
      totalPrice: 1717000,
      status: 'PENDING',
    }

    const orderCreate = vi.fn().mockResolvedValue(createdOrder)

    vi.mocked(prisma.cart.findFirst).mockResolvedValueOnce(cart as never)
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(null)

    vi.mocked(prisma.$transaction).mockImplementationOnce(
      async (callback: any) =>
        callback({
          order: {
            create: orderCreate,
          },
        } as never),
    )

    const result = await OrderService.createOrder({
      userId: 'user-123',
      shippingInfo: {
        firstName: 'Ashkan',
        lastName: 'Test',
        email: 'test@example.com',
        phone: '09120000000',
        city: 'Tehran',
        province: 'Tehran',
        address: 'Test address',
        postalCode: '1234567890',
        notes: 'Leave at the door',
      },
      paymentMethod: 'zarinpal',
    })

    expect(result).toEqual(createdOrder)

    expect(orderCreate).toHaveBeenCalledWith({
      data: {
        userId: 'user-123',
        cartId: 'cart-123',
        totalPrice: 1717000,
        status: 'PENDING',
        paymentMethod: 'zarinpal',
        shippingFirstName: 'Ashkan',
        shippingLastName: 'Test',
        shippingEmail: 'test@example.com',
        shippingPhone: '09120000000',
        shippingCity: 'Tehran',
        shippingProvince: 'Tehran',
        shippingAddress: 'Test address',
        shippingPostalCode: '1234567890',
        shippingNotes: 'Leave at the door',
        items: {
          create: [
            {
              productId: 'product-1',
              quantity: 2,
              price: 500000,
            },
            {
              productId: 'product-2',
              quantity: 1,
              price: 300000,
            },
          ],
        },
      },
    })
  })

  it('applies free shipping when subtotal is exactly at the free-shipping threshold', async () => {
    const cart = {
      id: 'cart-123',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          price: 1_000_000,
          product: {
            id: 'product-1',
            isActive: true,
            price: 1_000_000,
          },
        },
      ],
    }

    const createdOrder = {
      id: 'order-123',
      cartId: 'cart-123',
      status: 'PENDING',
      totalPrice: 2180000,
    }

    const orderCreate = vi.fn().mockResolvedValue(createdOrder)

    vi.mocked(prisma.cart.findFirst).mockResolvedValueOnce(cart as never)
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(null)

    vi.mocked(prisma.$transaction).mockImplementationOnce(
      async (callback: any) =>
        callback({
          order: {
            create: orderCreate,
          },
        }),
    )

    const result = await OrderService.createOrder({
      userId: 'user-123',
      shippingInfo: {
        firstName: 'Ashkan',
        lastName: 'Test',
        email: 'test@example.com',
        phone: '09120000000',
        city: 'Tehran',
        province: 'Tehran',
        address: 'Test address',
        postalCode: '1234567890',
        notes: '',
      },
      paymentMethod: 'zarinpal',
    })

    expect(result).toEqual(createdOrder)

    expect(orderCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        totalPrice: 2180000,
      }),
    })
  })

  it('charges shipping when subtotal is one rial below the free-shipping threshold', async () => {
    const cart = {
      id: 'cart-123',
      userId: 'user-123',
      status: 'ACTIVE',
      items: [
        {
          id: 'item-1',
          productId: 'product-1',
          quantity: 1,
          price: 1999999,
          product: {
            id: 'product-1',
            isActive: true,
            price: 1999999,
          },
        },
      ],
    }

    const createdOrder = {
      id: 'order-123',
      cartId: 'cart-123',
      status: 'PENDING',
      totalPrice: 2479999,
    }

    const orderCreate = vi.fn().mockResolvedValue(createdOrder)

    vi.mocked(prisma.cart.findFirst).mockResolvedValueOnce(cart as never)
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(null)

    vi.mocked(prisma.$transaction).mockImplementationOnce(
      async (callback: any) =>
        callback({
          order: {
            create: orderCreate,
          },
        }),
    )

    const result = await OrderService.createOrder({
      userId: 'user-123',
      shippingInfo: {
        firstName: 'Ashkan',
        lastName: 'Test',
        email: 'test@example.com',
        phone: '09120000000',
        city: 'Tehran',
        province: 'Tehran',
        address: 'Test address',
        postalCode: '1234567890',
        notes: '',
      },
      paymentMethod: 'zarinpal',
    })

    expect(result).toEqual(createdOrder)

    expect(orderCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        totalPrice: 2479999,
      }),
    })
  })
})

describe('OrderService.updateOrderPaymentAuthority', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('updates the payment authority and request timestamp', async () => {
    const existingOrder = {
      id: 'order-123',
      status: 'PENDING',
      paymentAuthority: null,
    }

    const updatedOrder = {
      ...existingOrder,
      paymentAuthority: 'A123456789',
      paymentRequestedAt: new Date(),
    }

    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(
      existingOrder as never,
    )
    vi.mocked(prisma.order.update).mockResolvedValueOnce(updatedOrder as never)

    const result = await OrderService.updateOrderPaymentAuthority({
      orderId: 'order-123',
      authority: 'A123456789',
    })

    expect(result).toEqual(updatedOrder)

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: {
        id: 'order-123',
      },
    })

    expect(prisma.order.update).toHaveBeenCalledWith({
      where: {
        id: 'order-123',
      },
      data: {
        paymentAuthority: 'A123456789',
        paymentRequestedAt: expect.any(Date),
      },
    })
  })

  it('throws when the order does not exist', async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(null)

    await expect(
      OrderService.updateOrderPaymentAuthority({
        orderId: 'missing-order',
        authority: 'A123456789',
      }),
    ).rejects.toThrow('Order with ID missing-order not found')

    expect(prisma.order.update).not.toHaveBeenCalled()
  })
})

describe('OrderService.findOrderByAuthority', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the order when the payment authority matches exactly', async () => {
    const order = {
      id: 'order-123',
      paymentAuthority: 'A123456789',
      status: 'PENDING',
      items: [
        {
          id: 'item-1',
          product: {
            id: 'product-1',
            title: 'Test Product',
          },
        },
      ],
    }

    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(order as never)

    const result = await OrderService.findOrderByAuthority('A123456789')

    expect(result).toEqual(order)

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: {
        paymentAuthority: 'A123456789',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  })

  it('returns null when the exact payment authority is not found', async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(null)

    const result = await OrderService.findOrderByAuthority('A123456789')

    expect(result).toBeNull()

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: {
        paymentAuthority: 'A123456789',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })
  })

  it('returns null when the payment authority is not found', async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValueOnce(null)

    const result = await OrderService.findOrderByAuthority('A123456789')

    expect(result).toBeNull()

    expect(prisma.order.findUnique).toHaveBeenCalledTimes(1)
  })
})

describe('OrderService.verifyAndFinalizePayment', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('marks the order as PAID and checks out its cart', async () => {
    const order = {
      id: 'order-123',
      cartId: 'cart-123',
      paymentAuthority: 'A123456789',
      status: 'PENDING',
      cart: {
        id: 'cart-123',
        status: 'ACTIVE',
      },
    }

    const updatedOrder = {
      ...order,
      status: 'PAID',
      paymentRefId: 'REF-123',
    }

    const txOrderUpdateMany = vi.fn().mockResolvedValue({ count: 1 })
    const txOrderFindUnique = vi.fn().mockResolvedValue(updatedOrder)

    const txCartUpdate = vi.fn().mockResolvedValue({
      ...order.cart,
      status: 'CHECKED_OUT',
    })

    vi.mocked(prisma.order.findFirst).mockResolvedValueOnce(order as never)

    vi.mocked(prisma.$transaction).mockImplementationOnce(
      async (callback: any) => {
        return callback({
          order: {
            updateMany: txOrderUpdateMany,
            findUnique: txOrderFindUnique,
          },
          cart: {
            update: txCartUpdate,
          },
        })
      },
    )

    const result = await OrderService.verifyAndFinalizePayment({
      authority: 'A123456789',
      refId: 'REF-123',
      status: 'PAID',
    })

    expect(result).toEqual(updatedOrder)

    expect(txOrderUpdateMany).toHaveBeenCalledWith({
      where: {
        id: 'order-123',
        status: 'PENDING',
      },
      data: {
        status: 'PAID',
        paymentRefId: 'REF-123',
        paymentVerifiedAt: expect.any(Date),
        paymentErrorMessage: undefined,
      },
    })

    expect(txOrderFindUnique).toHaveBeenCalledWith({
      where: {
        id: 'order-123',
      },
    })

    expect(txCartUpdate).toHaveBeenCalledWith({
      where: {
        id: 'cart-123',
      },
      data: {
        status: 'CHECKED_OUT',
      },
    })
  })

  it('marks the order as FAILED without checking out its cart', async () => {
    const order = {
      id: 'order-123',
      cartId: 'cart-123',
      paymentAuthority: 'A123456789',
      status: 'PENDING',
      cart: {
        id: 'cart-123',
        status: 'ACTIVE',
      },
    }

    const updatedOrder = {
      ...order,
      status: 'FAILED',
      paymentRefId: 'REF-123',
      paymentErrorMessage: 'Payment failed',
    }

    const txOrderUpdateMany = vi.fn().mockResolvedValue({ count: 1 })
    const txOrderFindUnique = vi.fn().mockResolvedValue(updatedOrder)
    const txCartUpdate = vi.fn()

    vi.mocked(prisma.order.findFirst).mockResolvedValueOnce(order as never)

    vi.mocked(prisma.$transaction).mockImplementationOnce(
      async (callback: any) => {
        return callback({
          order: {
            updateMany: txOrderUpdateMany,
            findUnique: txOrderFindUnique,
          },
          cart: {
            update: txCartUpdate,
          },
        })
      },
    )

    const result = await OrderService.verifyAndFinalizePayment({
      authority: 'A123456789',
      refId: 'REF-123',
      status: 'FAILED',
      errorMessage: 'Payment failed',
    })

    expect(result).toEqual(updatedOrder)

    expect(txOrderUpdateMany).toHaveBeenCalledWith({
      where: {
        id: 'order-123',
        status: 'PENDING',
      },
      data: {
        status: 'FAILED',
        paymentRefId: 'REF-123',
        paymentVerifiedAt: expect.any(Date),
        paymentErrorMessage: 'Payment failed',
      },
    })

    expect(txCartUpdate).not.toHaveBeenCalled()
  })

  it('throws when no order exists for the payment authority', async () => {
    vi.mocked(prisma.order.findFirst).mockResolvedValueOnce(null)

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority: 'UNKNOWN-AUTHORITY',
        refId: 'REF-123',
        status: 'PAID',
      }),
    ).rejects.toThrow('Order not found for authority: UNKNOWN-AUTHORITY')

    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('does not re-finalize an order that is already PAID', async () => {
    const order = {
      id: 'order-123',
      cartId: 'cart-123',
      paymentAuthority: 'A123456789',
      status: 'PAID',
      cart: {
        id: 'cart-123',
        status: 'CHECKED_OUT',
      },
    }

    vi.mocked(prisma.order.findFirst).mockResolvedValueOnce(order as never)

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority: 'A123456789',
        refId: 'REF-123',
        status: 'PAID',
      }),
    ).rejects.toThrow()

    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('does not finalize an order that is already FAILED', async () => {
    const order = {
      id: 'order-123',
      cartId: 'cart-123',
      paymentAuthority: 'A123456789',
      status: 'FAILED',
      cart: {
        id: 'cart-123',
        status: 'ACTIVE',
      },
    }

    vi.mocked(prisma.order.findFirst).mockResolvedValueOnce(order as never)

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority: 'A123456789',
        refId: 'REF-123',
        status: 'PAID',
      }),
    ).rejects.toThrow('Order order-123 is already finalized with status FAILED')

    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('throws when the order is no longer pending during atomic finalization', async () => {
    vi.mocked(prisma.order.findFirst).mockResolvedValue({
      id: 'order-1',
      paymentAuthority: 'AUTH123',
      status: 'PENDING',
      cartId: 'cart-1',
      cart: { id: 'cart-1' },
    } as any)

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) =>
      callback({
        order: {
          updateMany: vi.fn().mockResolvedValue({ count: 0 }),
          findUnique: vi.fn(),
        },
        cart: {
          update: vi.fn(),
        },
      }),
    )

    await expect(
      OrderService.verifyAndFinalizePayment({
        authority: 'AUTH123',
        refId: 'REF123',
        status: 'PAID',
      }),
    ).rejects.toThrow(
      'Order order-1 is no longer pending and cannot be finalized',
    )
  })
})

describe('OrderService.updateOrder', () => {
  it('updates the order status and shipping notes', async () => {
    const currentOrder = {
      id: 'order-1',
      status: 'PENDING',
    }

    const updatedOrder = {
      ...currentOrder,
      status: 'PAID',
      shippingNotes: 'Leave at the door',
    }

    vi.mocked(prisma.order.findUnique).mockResolvedValue(currentOrder as any)
    vi.mocked(prisma.order.update).mockResolvedValue(updatedOrder as any)

    const result = await OrderService.updateOrder({
      orderId: 'order-1',
      status: 'PAID',
      shippingNotes: 'Leave at the door',
    })

    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { id: 'order-1' },
    })

    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { id: 'order-1' },
      data: {
        status: 'PAID',
        shippingNotes: 'Leave at the door',
      },
    })

    expect(result).toEqual(updatedOrder)
  })

  it('throws when the order does not exist', async () => {
    vi.mocked(prisma.order.findUnique).mockResolvedValue(null)
    vi.mocked(prisma.order.update).mockClear()

    await expect(
      OrderService.updateOrder({
        orderId: 'missing-order',
        status: 'PAID',
        shippingNotes: 'Leave at the door',
      }),
    ).rejects.toThrow('Order not found')

    expect(prisma.order.update).not.toHaveBeenCalled()
  })

  it('deletes a CANCELED order and creates a new PENDING order', async () => {
    const canceledOrder = {
      id: 'order-old',
      cartId: 'cart-1',
      status: 'CANCELED',
    }

    const cart = {
      id: 'cart-1',
      items: [
        {
          productId: 'product-1',
          quantity: 2,
          price: 500_000,
          product: {
            id: 'product-1',
            isActive: true,
            price: 500_000,
          },
        },
      ],
    }

    const newOrder = {
      id: 'order-new',
      cartId: 'cart-1',
      status: 'PENDING',
      totalPrice: 1_090_000,
    }

    vi.mocked(prisma.cart.findFirst).mockResolvedValue(cart as any)
    vi.mocked(prisma.order.findUnique).mockResolvedValue(canceledOrder as any)

    const txOrderItemDeleteMany = vi.fn().mockResolvedValue({})
    const txOrderDelete = vi.fn().mockResolvedValue({})
    const txOrderCreate = vi.fn().mockResolvedValue(newOrder)

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) =>
      callback({
        orderItem: {
          deleteMany: txOrderItemDeleteMany,
        },
        order: {
          delete: txOrderDelete,
          create: txOrderCreate,
        },
      }),
    )

    const result = await OrderService.createOrder({
      userId: 'user-1',
      paymentMethod: 'zarinpal',
      shippingInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '09120000000',
        city: 'Tehran',
        province: 'Tehran',
        address: 'Test address',
        postalCode: '1234567890',
        notes: '',
      },
    })

    expect(txOrderItemDeleteMany).toHaveBeenCalledWith({
      where: { orderId: 'order-old' },
    })

    expect(txOrderDelete).toHaveBeenCalledWith({
      where: { id: 'order-old' },
    })

    expect(txOrderCreate).toHaveBeenCalled()

    expect(result).toEqual(newOrder)
  })

  it('returns null when the authority is empty', async () => {
    vi.mocked(prisma.order.findFirst).mockClear()

    const result = await OrderService.findOrderByAuthority('')

    expect(result).toBeNull()
    expect(prisma.order.findFirst).not.toHaveBeenCalled()
  })
})
