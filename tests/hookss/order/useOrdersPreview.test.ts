import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrdersPreview } from '@/features/shop/hooks/orders/useOrdersPreview'
import { getOrdersPreview } from '@/features/shop/actions/orders/getOrdersPreviewAction'

import type { OrderSummary } from '@/features/shop/shop.types'

vi.mock('@/features/shop/actions/orders/getOrdersPreviewAction', () => ({
  getOrdersPreview: vi.fn(),
}))

const mockedGetOrdersPreview = vi.mocked(getOrdersPreview)

describe('useOrdersPreview', () => {
  const orders = [
    {
      id: 'order-1',
      status: 'PENDING',
    },
    {
      id: 'order-2',
      status: 'PAID',
    },
  ] as OrderSummary[]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have the correct initial state', () => {
    mockedGetOrdersPreview.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useOrdersPreview())

    expect(result.current.orders).toEqual([])
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should fetch orders successfully', async () => {
    mockedGetOrdersPreview.mockResolvedValue(orders)

    const { result } = renderHook(() => useOrdersPreview())

    await waitFor(() => {
      expect(result.current.orders).toEqual(orders)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set loading to false after successful request', async () => {
    mockedGetOrdersPreview.mockResolvedValue(orders)

    const { result } = renderHook(() => useOrdersPreview())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.orders).toEqual(orders)
  })

  it('should set error when fetching orders fails', async () => {
    const error = new Error('Failed to fetch orders')

    mockedGetOrdersPreview.mockRejectedValue(error)

    const { result } = renderHook(() => useOrdersPreview())

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch orders')
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.orders).toEqual([])
  })

  it('should use the original error message', async () => {
    const error = new Error('Database connection failed')

    mockedGetOrdersPreview.mockRejectedValue(error)

    const { result } = renderHook(() => useOrdersPreview())

    await waitFor(() => {
      expect(result.current.error).toBe('Database connection failed')
    })
  })

  it('should handle an empty orders response', async () => {
    mockedGetOrdersPreview.mockResolvedValue([])

    const { result } = renderHook(() => useOrdersPreview())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.orders).toEqual([])
    expect(result.current.error).toBeNull()
  })

  it('should call getOrdersPreview exactly once', async () => {
    mockedGetOrdersPreview.mockResolvedValue(orders)

    renderHook(() => useOrdersPreview())

    await waitFor(() => {
      expect(mockedGetOrdersPreview).toHaveBeenCalledTimes(1)
    })
  })

  it('should not update state after unmount', async () => {
    let resolveRequest!: (value: OrderSummary[]) => void

    const pendingRequest = new Promise<OrderSummary[]>((resolve) => {
      resolveRequest = resolve
    })

    mockedGetOrdersPreview.mockReturnValue(pendingRequest)

    const { result, unmount } = renderHook(() => useOrdersPreview())

    expect(result.current.loading).toBe(true)
    expect(result.current.orders).toEqual([])

    unmount()

    await act(async () => {
      resolveRequest(orders)
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.orders).toEqual([])
  })

  it('should not update error after unmount', async () => {
    let rejectRequest!: (error: Error) => void

    const pendingRequest = new Promise<OrderSummary[]>((_, reject) => {
      rejectRequest = reject
    })

    mockedGetOrdersPreview.mockReturnValue(pendingRequest)

    const { result, unmount } = renderHook(() => useOrdersPreview())

    unmount()

    await act(async () => {
      rejectRequest(new Error('Network error'))
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.error).toBeNull()
  })
})
