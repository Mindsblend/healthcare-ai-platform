import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'

import { useCreateOrder } from '@/features/shop/hooks/orders/createOrders'
import { createOrderAction } from '@/features/shop/actions/orders/createOrdersAction'

import type {
  CreateOrderInput,
  OrderDetail,
} from '@/features/shop/shop.types'

vi.mock('@/features/shop/actions/orders/createOrdersAction', () => ({
  createOrderAction: vi.fn(),
}))

const createOrderActionMock = vi.mocked(createOrderAction)

const order: CreateOrderInput = {
  cartId: 'cart-1',
}

const orderResponse: OrderDetail = {
  id: 'order-1',
} as OrderDetail

describe('useCreateOrder', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have the correct initial state', () => {
    const { result } = renderHook(() => useCreateOrder())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.data).toBe(null)
  })

  it('should set loading to true while creating the order', async () => {
    let resolveRequest!: (value: OrderDetail) => void

    createOrderActionMock.mockImplementation(
      () =>
        new Promise<OrderDetail>((resolve) => {
          resolveRequest = resolve
        }),
    )

    const { result } = renderHook(() => useCreateOrder())

    let promise!: Promise<OrderDetail>

    act(() => {
      promise = result.current.createOrder(order)
    })

    expect(result.current.loading).toBe(true)

    await act(async () => {
      resolveRequest(orderResponse)
      await promise
    })

    expect(result.current.loading).toBe(false)
  })

  it('should create the order successfully', async () => {
    createOrderActionMock.mockResolvedValue(orderResponse)

    const { result } = renderHook(() => useCreateOrder())

    let returnedData!: OrderDetail

    await act(async () => {
      returnedData = await result.current.createOrder(order)
    })

    expect(returnedData).toEqual(orderResponse)
    expect(result.current.data).toEqual(orderResponse)
    expect(result.current.error).toBe(null)
    expect(result.current.loading).toBe(false)

    expect(createOrderActionMock).toHaveBeenCalledTimes(1)
    expect(createOrderActionMock).toHaveBeenCalledWith(order)
  })

  it('should set error when creating the order fails', async () => {
    const error = new Error('Failed to create order')

    createOrderActionMock.mockRejectedValue(error)

    const { result } = renderHook(() => useCreateOrder())

    await act(async () => {
      await expect(
        result.current.createOrder(order),
      ).rejects.toBe(error)
    })

    expect(result.current.error).toBe(error)
    expect(result.current.loading).toBe(false)
  })

  it('should rethrow the original error', async () => {
    const error = new Error('Order creation failed')

    createOrderActionMock.mockRejectedValue(error)

    const { result } = renderHook(() => useCreateOrder())

    let caughtError: unknown

    await act(async () => {
      try {
        await result.current.createOrder(order)
      } catch (err) {
        caughtError = err
      }
    })

    expect(caughtError).toBe(error)

    await waitFor(() => {
      expect(result.current.error).toBe(error)
    })
  })

  it('should clear previous error before creating a new order', async () => {
    const firstError = new Error('First request failed')

    createOrderActionMock.mockRejectedValueOnce(firstError)

    const { result } = renderHook(() => useCreateOrder())

    await act(async () => {
      await expect(
        result.current.createOrder(order),
      ).rejects.toBe(firstError)
    })

    expect(result.current.error).toBe(firstError)

    createOrderActionMock.mockResolvedValueOnce(orderResponse)

    await act(async () => {
      await result.current.createOrder(order)
    })

    expect(result.current.error).toBe(null)
    expect(result.current.data).toEqual(orderResponse)
  })

  it('should set loading to false after an error', async () => {
    const error = new Error('Network error')

    createOrderActionMock.mockRejectedValue(error)

    const { result } = renderHook(() => useCreateOrder())

    await act(async () => {
      await expect(
        result.current.createOrder(order),
      ).rejects.toBe(error)
    })

    expect(result.current.loading).toBe(false)
  })

  it('should keep previous data when a new request fails', async () => {
    createOrderActionMock.mockResolvedValueOnce(orderResponse)

    const { result } = renderHook(() => useCreateOrder())

    await act(async () => {
      await result.current.createOrder(order)
    })

    expect(result.current.data).toEqual(orderResponse)

    const error = new Error('Second request failed')

    createOrderActionMock.mockRejectedValueOnce(error)

    await act(async () => {
      await expect(
        result.current.createOrder(order),
      ).rejects.toBe(error)
    })

    expect(result.current.data).toEqual(orderResponse)
    expect(result.current.error).toBe(error)
    expect(result.current.loading).toBe(false)
  })

  it('should pass the exact input to createOrderAction', async () => {
    createOrderActionMock.mockResolvedValue(orderResponse)

    const { result } = renderHook(() => useCreateOrder())

    const customOrder: CreateOrderInput = {
      cartId: 'cart-123',
    }

    await act(async () => {
      await result.current.createOrder(customOrder)
    })

    expect(createOrderActionMock).toHaveBeenCalledTimes(1)
    expect(createOrderActionMock).toHaveBeenCalledWith(customOrder)
  })
})