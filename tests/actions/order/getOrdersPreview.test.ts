import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { getOrdersPreview } from '@/features/shop/actions/orders/getOrdersPreviewAction'
import type { GetOrdersPreviewResponse } from '@/features/shop/shop.types'

describe('getOrdersPreview', () => {
  const ordersResponse = [
    {
      id: 'order-1',
      userId: 'user-1',
      status: 'PENDING',
      total: 200000,
      items: [],
    },
    {
      id: 'order-2',
      userId: 'user-1',
      status: 'PAID',
      total: 350000,
      items: [],
    },
  ] as GetOrdersPreviewResponse

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should get orders successfully', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(ordersResponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    )

    const result = await getOrdersPreview()

    expect(result).toEqual(ordersResponse)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    expect(fetchMock).toHaveBeenCalledWith('/api/shop/orders')
  })

  it('should throw an error when response is not ok', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Failed to get orders',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(getOrdersPreview()).rejects.toThrow('Failed to get orders')
  })

  it('should throw an error when response status is 401', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Unauthorized',
        }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(getOrdersPreview()).rejects.toThrow('Failed to get orders')
  })

  it('should throw an error when response status is 404', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          error: 'Orders not found',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      ),
    )

    await expect(getOrdersPreview()).rejects.toThrow('Failed to get orders')
  })

  it('should propagate fetch errors', async () => {
    const fetchMock = vi.mocked(fetch)

    fetchMock.mockRejectedValueOnce(new Error('Network error'))

    await expect(getOrdersPreview()).rejects.toThrow('Network error')
  })

  it('should return the response JSON as-is', async () => {
    const fetchMock = vi.mocked(fetch)

    const customResponse = [
      {
        id: 'order-999',
        userId: 'user-1',
        status: 'DELIVERED',
        total: 500000,
        items: [],
      },
    ] as GetOrdersPreviewResponse

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify(customResponse), {
        status: 200,
      }),
    )

    const result = await getOrdersPreview()

    expect(result).toEqual(customResponse)
  })

  it('should not call json when response is not ok', async () => {
    const fetchMock = vi.mocked(fetch)

    const jsonMock = vi.fn()

    const response = {
      ok: false,
      json: jsonMock,
    } as unknown as Response

    fetchMock.mockResolvedValueOnce(response)

    await expect(getOrdersPreview()).rejects.toThrow('Failed to get orders')

    expect(jsonMock).not.toHaveBeenCalled()
  })
})
