import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useOrderById } from '@/features/shop/hooks/orders/useOrderById'
import { getOrderById } from '@/features/shop/actions/orders/getOrderByIdAction'

import type {
  GetOrderByIdInput,
  GetOrderByIdResponse,
} from '@/features/shop/shop.types'

vi.mock('@/features/shop/actions/orders/getOrderByIdAction', () => ({
  getOrderById: vi.fn(),
}))

const mockedGetOrderById = vi.mocked(getOrderById)

describe('useOrderById', () => {
  const firstOrder = {
    id: 'order-1',
    status: 'PENDING',
  } as GetOrderByIdResponse

  const secondOrder = {
    id: 'order-2',
    status: 'PAID',
  } as GetOrderByIdResponse

  const input: GetOrderByIdInput = {
    id: 'order-1',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have the correct initial state', () => {
    mockedGetOrderById.mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useOrderById(input))

    expect(result.current.order).toBeNull()
    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()
  })

  it('should fetch the order successfully', async () => {
    mockedGetOrderById.mockResolvedValue(firstOrder)

    const { result } = renderHook(() => useOrderById(input))

    await waitFor(() => {
      expect(result.current.order).toEqual(firstOrder)
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should set loading to false after successful request', async () => {
    mockedGetOrderById.mockResolvedValue(firstOrder)

    const { result } = renderHook(() => useOrderById(input))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.order).toEqual(firstOrder)
  })

  it('should set error when fetching the order fails', async () => {
    const error = new Error('Order not found')

    mockedGetOrderById.mockRejectedValue(error)

    const { result } = renderHook(() => useOrderById(input))

    await waitFor(() => {
      expect(result.current.error).toBe('Order not found')
    })

    expect(result.current.loading).toBe(false)
  })

  it('should use the error message from the original error', async () => {
    const error = new Error('Database connection failed')

    mockedGetOrderById.mockRejectedValue(error)

    const { result } = renderHook(() => useOrderById(input))

    await waitFor(() => {
      expect(result.current.error).toBe('Database connection failed')
    })
  })

  it('should not fetch when order id is empty', async () => {
    const emptyInput: GetOrderByIdInput = {
      id: '',
    }

    const { result } = renderHook(() => useOrderById(emptyInput))

    expect(mockedGetOrderById).not.toHaveBeenCalled()
    expect(result.current.order).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('should fetch again when the order id changes', async () => {
    mockedGetOrderById
      .mockResolvedValueOnce(firstOrder)
      .mockResolvedValueOnce(secondOrder)

    const { result, rerender } = renderHook(
      ({ id }) =>
        useOrderById({
          id,
        }),
      {
        initialProps: {
          id: 'order-1',
        },
      },
    )

    await waitFor(() => {
      expect(result.current.order).toEqual(firstOrder)
    })

    expect(mockedGetOrderById).toHaveBeenCalledTimes(1)

    rerender({
      id: 'order-2',
    })

    await waitFor(() => {
      expect(result.current.order).toEqual(secondOrder)
    })

    expect(mockedGetOrderById).toHaveBeenCalledTimes(2)

    expect(mockedGetOrderById).toHaveBeenNthCalledWith(1, {
      id: 'order-1',
    })

    expect(mockedGetOrderById).toHaveBeenNthCalledWith(2, {
      id: 'order-2',
    })
  })

  it('should clear previous error before a new request', async () => {
    const firstError = new Error('First request failed')

    mockedGetOrderById
      .mockRejectedValueOnce(firstError)
      .mockResolvedValueOnce(secondOrder)

    const { result, rerender } = renderHook(
      ({ id }) =>
        useOrderById({
          id,
        }),
      {
        initialProps: {
          id: 'order-1',
        },
      },
    )

    await waitFor(() => {
      expect(result.current.error).toBe('First request failed')
    })

    expect(result.current.loading).toBe(false)

    rerender({
      id: 'order-2',
    })

    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.order).toEqual(secondOrder)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should set loading to true when a new order is requested', async () => {
    let resolveFirst!: (value: GetOrderByIdResponse) => void

    let resolveSecond!: (value: GetOrderByIdResponse) => void

    const firstRequest = new Promise<GetOrderByIdResponse>((resolve) => {
      resolveFirst = resolve
    })

    const secondRequest = new Promise<GetOrderByIdResponse>((resolve) => {
      resolveSecond = resolve
    })

    mockedGetOrderById
      .mockReturnValueOnce(firstRequest)
      .mockReturnValueOnce(secondRequest)

    const { result, rerender } = renderHook(
      ({ id }) =>
        useOrderById({
          id,
        }),
      {
        initialProps: {
          id: 'order-1',
        },
      },
    )

    expect(result.current.loading).toBe(true)

    rerender({
      id: 'order-2',
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()

    await act(async () => {
      resolveSecond(secondOrder)
    })

    await waitFor(() => {
      expect(result.current.order).toEqual(secondOrder)
    })

    expect(result.current.loading).toBe(false)

    await act(async () => {
      resolveFirst(firstOrder)
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.order).toEqual(secondOrder)
  })

  it('should ignore stale response from an old request', async () => {
    let resolveFirst!: (value: GetOrderByIdResponse) => void

    let resolveSecond!: (value: GetOrderByIdResponse) => void

    const firstRequest = new Promise<GetOrderByIdResponse>((resolve) => {
      resolveFirst = resolve
    })

    const secondRequest = new Promise<GetOrderByIdResponse>((resolve) => {
      resolveSecond = resolve
    })

    mockedGetOrderById
      .mockReturnValueOnce(firstRequest)
      .mockReturnValueOnce(secondRequest)

    const { result, rerender } = renderHook(
      ({ id }) =>
        useOrderById({
          id,
        }),
      {
        initialProps: {
          id: 'order-1',
        },
      },
    )

    rerender({
      id: 'order-2',
    })

    await act(async () => {
      resolveSecond(secondOrder)
    })

    await waitFor(() => {
      expect(result.current.order).toEqual(secondOrder)
    })

    expect(result.current.order).toEqual(secondOrder)

    await act(async () => {
      resolveFirst(firstOrder)
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.order).toEqual(secondOrder)
    expect(result.current.order).not.toEqual(firstOrder)
  })

  it('should ignore stale error from an old request', async () => {
    let rejectFirst!: (error: Error) => void

    let resolveSecond!: (value: GetOrderByIdResponse) => void

    const firstRequest = new Promise<GetOrderByIdResponse>((_, reject) => {
      rejectFirst = reject
    })

    const secondRequest = new Promise<GetOrderByIdResponse>((resolve) => {
      resolveSecond = resolve
    })

    mockedGetOrderById
      .mockReturnValueOnce(firstRequest)
      .mockReturnValueOnce(secondRequest)

    const { result, rerender } = renderHook(
      ({ id }) =>
        useOrderById({
          id,
        }),
      {
        initialProps: {
          id: 'order-1',
        },
      },
    )

    rerender({
      id: 'order-2',
    })

    await act(async () => {
      resolveSecond(secondOrder)
    })

    await waitFor(() => {
      expect(result.current.order).toEqual(secondOrder)
    })

    await act(async () => {
      rejectFirst(new Error('Old request failed'))
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.order).toEqual(secondOrder)
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should pass the exact input to getOrderById', async () => {
    mockedGetOrderById.mockResolvedValue(firstOrder)

    const customInput: GetOrderByIdInput = {
      id: 'order-custom-123',
    }

    renderHook(() => useOrderById(customInput))

    await waitFor(() => {
      expect(mockedGetOrderById).toHaveBeenCalledWith(customInput)
    })
  })

  it('should cleanup pending request when unmounted', async () => {
    let resolveRequest!: (value: GetOrderByIdResponse) => void

    const pendingRequest = new Promise<GetOrderByIdResponse>((resolve) => {
      resolveRequest = resolve
    })

    mockedGetOrderById.mockReturnValue(pendingRequest)

    const { result, unmount } = renderHook(() => useOrderById(input))

    expect(result.current.loading).toBe(true)

    unmount()

    await act(async () => {
      resolveRequest(firstOrder)
    })

    await new Promise((resolve) => setTimeout(resolve, 0))

    expect(result.current.order).toBeNull()
  })
})
