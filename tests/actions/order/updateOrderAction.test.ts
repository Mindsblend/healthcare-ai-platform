import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { updateOrderAction } from '@/features/shop/actions/orders/updateOrderAction'
import type {
  UpdateOrderInput,
  OrderSummary,
} from '@/features/shop/shop.types'

describe('updateOrderAction', () => {
  const input: UpdateOrderInput = {
    id: 'order-1',
    status: 'PAID',
  } as UpdateOrderInput

  const orderResponse = {
    id: 'order-1',
    userId: 'user-1',
    status: 'PAID',
    total: 200000,
  } as OrderSummary

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should update an order successfully', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(orderResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await updateOrderAction(input)

    expect(result).toEqual(orderResponse)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/orders/update',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      },
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
      id: 'order-123',
      status: 'PROCESSING',
    } as UpdateOrderInput

    await updateOrderAction(customInput)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/orders/update',
      expect.objectContaining({
        body: JSON.stringify(customInput),
      }),
    )
  })

  it('should use POST method', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(orderResponse), {
        status: 200,
      }),
    )

    await updateOrderAction(input)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/orders/update',
      expect.objectContaining({
        method: 'POST',
      }),
    )
  })

  it('should send Content-Type application/json', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(orderResponse), {
        status: 200,
      }),
    )

    await updateOrderAction(input)

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/shop/orders/update',
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )
  })

  it('should throw the API error when response is not ok', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Order cannot be updated',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(updateOrderAction(input)).rejects.toThrow(
      'Order cannot be updated',
    )
  })

  it('should use fallback error when API does not provide an error', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({}), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    await expect(updateOrderAction(input)).rejects.toThrow(
      'Failed to update order',
    )
  })

  it('should use fallback error when error is null', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: null,
        }),
        {
          status: 500,
        },
      ),
    )

    await expect(updateOrderAction(input)).rejects.toThrow(
      'Failed to update order',
    )
  })

  it('should use fallback error when error is an empty string', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: '',
        }),
        {
          status: 500,
        },
      ),
    )

    await expect(updateOrderAction(input)).rejects.toThrow(
      'Failed to update order',
    )
  })

  it('should handle unauthorized response', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Unauthorized',
        }),
        {
          status: 401,
        },
      ),
    )

    await expect(updateOrderAction(input)).rejects.toThrow('Unauthorized')
  })

  it('should handle not found response', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Order not found',
        }),
        {
          status: 404,
        },
      ),
    )

    await expect(updateOrderAction(input)).rejects.toThrow(
      'Order not found',
    )
  })

  it('should propagate fetch errors', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockRejectedValueOnce(new Error('Network error'))

    await expect(updateOrderAction(input)).rejects.toThrow('Network error')
  })

  it('should return the response JSON as-is', async () => {
    const fetchMock = vi.mocked(fetch)

    const customResponse = {
      id: 'order-999',
      userId: 'user-1',
      status: 'DELIVERED',
      total: 500000,
    } as OrderSummary

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(customResponse), {
        status: 200,
      }),
    )

    const result = await updateOrderAction({
      id: 'order-999',
      status: 'DELIVERED',
    } as UpdateOrderInput)

    expect(result).toEqual(customResponse)
  })
})