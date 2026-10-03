import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

import { useUpdateOrder } from '@/features/shop/hooks/orders/updateOrder'
import { updateOrderAction } from '@/features/shop/actions/orders/updateOrderAction'

import type {
  UpdateOrderInput,
  UpdateOrderResponse,
} from '@/features/shop/shop.types'

vi.mock('@/features/shop/actions/orders/updateOrderAction', () => ({
  updateOrderAction: vi.fn(),
}))

const updateOrderActionMock = vi.mocked(updateOrderAction)

const orderInput: UpdateOrderInput = {
  id: 'order-1',
  status: 'PAID',
} as UpdateOrderInput

const orderResponse: UpdateOrderResponse = {
  id: 'order-1',
  status: 'PAID',
} as UpdateOrderResponse

describe('useUpdateOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have the correct initial state', () => {
    const { result } = renderHook(() => useUpdateOrder())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.data).toBe(null)
  })

  it('should set loading to true while updating the order', async () => {
    let resolveRequest!: (value: UpdateOrderResponse) => void

    updateOrderActionMock.mockImplementation(
      () =>
        new Promise<UpdateOrderResponse>((resolve) => {
          resolveRequest = resolve
        }),
    )

    const { result } = renderHook(() => useUpdateOrder())

    let promise!: Promise<UpdateOrderResponse>

    act(() => {
      promise = result.current.updateOrder(orderInput)
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolveRequest(orderResponse)
      await promise
    })

    expect(result.current.loading).toBe(false)
  })

  it('should update the order successfully', async () => {
    updateOrderActionMock.mockResolvedValue(orderResponse)

    const { result } = renderHook(() => useUpdateOrder())

    let returnedData!: UpdateOrderResponse

    await act(async () => {
      returnedData = await result.current.updateOrder(orderInput)
    })

    expect(returnedData).toEqual(orderResponse)
    expect(result.current.data).toEqual(orderResponse)
    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(false)

    expect(updateOrderActionMock).toHaveBeenCalledTimes(1)
    expect(updateOrderActionMock).toHaveBeenCalledWith(orderInput)
  })

  it('should set error when updating the order fails', async () => {
    const error = new Error('Failed to update order')

    updateOrderActionMock.mockRejectedValue(error)

    const { result } = renderHook(() => useUpdateOrder())

    await act(async () => {
      await expect(
        result.current.updateOrder(orderInput),
      ).rejects.toBe(error)
    })

    expect(result.current.error).toBe(error)
    expect(result.current.loading).toBe(false)
  })

  it('should rethrow the original error', async () => {
    const error = new Error('Order update failed')

    updateOrderActionMock.mockRejectedValue(error)

    const { result } = renderHook(() => useUpdateOrder())

    let caughtError: unknown

    await act(async () => {
      try {
        await result.current.updateOrder(orderInput)
      } catch (err) {
        caughtError = err
      }
    })

    expect(caughtError).toBe(error)

    await waitFor(() => {
      expect(result.current.error).toBe(error)
    })
  })

  it('should clear previous error before updating a new order', async () => {
    const firstError = new Error('First update failed')

    updateOrderActionMock.mockRejectedValueOnce(firstError)

    const { result } = renderHook(() => useUpdateOrder())

    await act(async () => {
      await expect(
        result.current.updateOrder(orderInput),
      ).rejects.toBe(firstError)
    })

    expect(result.current.error).toBe(firstError)

    updateOrderActionMock.mockResolvedValueOnce(orderResponse)

    await act(async () => {
      await result.current.updateOrder(orderInput)
    })

    expect(result.current.error).toBe(null)
    expect(result.current.data).toEqual(orderResponse)
  })

  it('should set loading to false after an error', async () => {
    const error = new Error('Network error')

    updateOrderActionMock.mockRejectedValue(error)

    const { result } = renderHook(() => useUpdateOrder())

    await act(async () => {
      await expect(
        result.current.updateOrder(orderInput),
      ).rejects.toBe(error)
    })

    expect(result.current.loading).toBe(false)
  })

  it('should keep previous data when a new update fails', async () => {
    updateOrderActionMock.mockResolvedValueOnce(orderResponse)

    const { result } = renderHook(() => useUpdateOrder())

    await act(async () => {
      await result.current.updateOrder(orderInput)
    })

    expect(result.current.data).toEqual(orderResponse)

    const error = new Error('Second update failed')

    updateOrderActionMock.mockRejectedValueOnce(error)

    await act(async () => {
      await expect(
        result.current.updateOrder(orderInput),
      ).rejects.toBe(error)
    })

    expect(result.current.data).toEqual(orderResponse)
    expect(result.current.error).toBe(error)
    expect(result.current.loading).toBe(false)
  })

  it('should pass the exact input to updateOrderAction', async () => {
    updateOrderActionMock.mockResolvedValue(orderResponse)

    const { result } = renderHook(() => useUpdateOrder())

    const customInput: UpdateOrderInput = {
      id: 'order-999',
      status: 'SHIPPED',
    } as UpdateOrderInput

    await act(async () => {
      await result.current.updateOrder(customInput)
    })

    expect(updateOrderActionMock).toHaveBeenCalledTimes(1)
    expect(updateOrderActionMock).toHaveBeenCalledWith(customInput)
  })
})