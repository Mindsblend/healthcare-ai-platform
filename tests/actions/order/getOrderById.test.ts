import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getOrderById } from '@/features/shop/actions/orders/getOrderByIdAction'
import type {
  GetOrderByIdInput,
  GetOrderByIdResponse,
} from '@/features/shop/shop.types'

describe('getOrderById', () => {
  const input: GetOrderByIdInput = {
    id: 'order-1',
  }

  const orderResponse = {
    id: 'order-1',
    userId: 'user-1',
    status: 'PENDING',
    total: 200000,
    items: [],
  } as GetOrderByIdResponse

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should get an order successfully', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(orderResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await getOrderById(input)

    expect(result).toEqual(orderResponse)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(fetchMock).toHaveBeenCalledWith('/api/shop/orders/order-1')
  })

  it('should encode the order id before adding it to the URL', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(orderResponse), {
        status: 200,
      }),
    )

    const customInput = {
      id: 'order/test?id=123',
    } as GetOrderByIdInput

    await getOrderById(customInput)

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/shop/orders/${encodeURIComponent(customInput.id)}`,
    )
  })

  it('should throw an error when the response is not ok', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Order not found',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(getOrderById(input)).rejects.toThrow('Failed to get order')
  })

  it('should throw an error for server errors', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Internal server error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(getOrderById(input)).rejects.toThrow('Failed to get order')
  })

  it('should propagate fetch errors', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockRejectedValueOnce(new Error('Network error'))

    await expect(getOrderById(input)).rejects.toThrow('Network error')
  })

  it('should return the response JSON as-is', async () => {
    const fetchMock = vi.mocked(fetch)

    const customResponse = {
      ...orderResponse,
      id: 'order-999',
      status: 'PAID',
    }

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(customResponse), {
        status: 200,
      }),
    )

    const result = await getOrderById({
      id: 'order-999',
    })

    expect(result).toEqual(customResponse)
  })
})
