import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { createOrderAction } from '@/features/shop/actions/orders/createOrdersAction'
import type { CreateOrderInput, OrderDetail } from '@/features/shop/shop.types'

describe('createOrderAction', () => {
  const input: CreateOrderInput = {
    cartId: 'cart-1',
  }

  const orderResponse: OrderDetail = {
    id: 'order-1',
    userId: 'user-1',
    status: 'PENDING',
    total: 200000,
    items: [],
  } as OrderDetail

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should create an order successfully', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(orderResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await createOrderAction(input)

    expect(result).toEqual(orderResponse)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/orders/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      },
    )
  })

  it('should throw the API error when response is not ok', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Cart is empty',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(createOrderAction(input)).rejects.toThrow('Cart is empty')
  })

  it('should use fallback error when API does not provide an error message', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    await expect(createOrderAction(input)).rejects.toThrow(
      'Failed to create order',
    )
  })

  it('should use fallback error when error field is null', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: null,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(createOrderAction(input)).rejects.toThrow(
      'Failed to create order',
    )
  })

  it('should use fallback error when error field is empty', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: '',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(createOrderAction(input)).rejects.toThrow(
      'Failed to create order',
    )
  })

  it('should send the exact input in the request body', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(orderResponse), {
        status: 200,
      }),
    )

    const customInput = {
      cartId: 'cart-123',
    } as CreateOrderInput

    await createOrderAction(customInput)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/orders/create',
      expect.objectContaining({
        body: JSON.stringify(customInput),
      }),
    )
  })

  it('should propagate fetch errors', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockRejectedValueOnce(new Error('Network error'))

    await expect(createOrderAction(input)).rejects.toThrow('Network error')
  })
})