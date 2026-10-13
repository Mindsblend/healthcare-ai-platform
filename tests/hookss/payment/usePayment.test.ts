import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { usePayment } from '@/features/shop/hooks/payment/usePayment'
import { requestPaymentAction } from '@/features/shop/actions/payment/requestPaymentAction'

vi.mock('@/features/shop/actions/payment/requestPaymentAction', () => ({
  requestPaymentAction: vi.fn(),
}))

const mockedRequestPaymentAction = vi.mocked(requestPaymentAction)

describe('usePayment', () => {
  const paymentInput = {
    amount: 100_000,
    description: 'خرید محصول',
    orderId: 'order-123',
    email: 'test@example.com',
    mobile: '09120000000',
  }

  const paymentResult = {
    success: true as const,
    authority: 'S00000000000000000000000000000TEST',
    paymentUrl:
      'https://sandbox.zarinpal.com/pg/StartPay/S00000000000000000000000000000TEST',
  }

  let replaceMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    replaceMock = vi.fn()

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        ...window.location,
        replace: replaceMock,
      },
    })
  })

  // =========================================================
  // Initial state
  // =========================================================

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => usePayment())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.initiatePayment).toBe('function')
  })

  // =========================================================
  // Successful payment
  // =========================================================

  it('should successfully initiate payment', async () => {
    mockedRequestPaymentAction.mockResolvedValueOnce(paymentResult)

    const { result } = renderHook(() => usePayment())

    let response

    await act(async () => {
      response = await result.current.initiatePayment(paymentInput)
    })

    expect(response).toEqual(paymentResult)

    expect(mockedRequestPaymentAction).toHaveBeenCalledTimes(1)

    expect(mockedRequestPaymentAction).toHaveBeenCalledWith(paymentInput)

    expect(replaceMock).toHaveBeenCalledTimes(1)

    expect(replaceMock).toHaveBeenCalledWith(
      paymentResult.paymentUrl,
    )
  })

  // =========================================================
  // Loading state
  // =========================================================

  it('should set loading to true while payment request is pending', async () => {
    let resolvePayment:
      | ((value: typeof paymentResult) => void)
      | undefined

    const paymentPromise = new Promise<typeof paymentResult>((resolve) => {
      resolvePayment = resolve
    })

    mockedRequestPaymentAction.mockReturnValueOnce(paymentPromise)

    const { result } = renderHook(() => usePayment())

    let initiatePromise: Promise<unknown>

    act(() => {
      initiatePromise = result.current.initiatePayment(paymentInput)
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.error).toBeNull()

    await act(async () => {
      resolvePayment!(paymentResult)

      await initiatePromise
    })

    expect(result.current.loading).toBe(true)
  })

  // =========================================================
  // Payment failure
  // =========================================================

  it('should handle payment initiation failure', async () => {
    mockedRequestPaymentAction.mockResolvedValueOnce({
      success: false,
      error: 'موجودی کافی نیست',
    })

    const { result } = renderHook(() => usePayment())

    let response

    await act(async () => {
      response = await result.current.initiatePayment(paymentInput)
    })

    expect(response).toEqual({
      success: false,
      error: 'موجودی کافی نیست',
    })

    expect(result.current.error).toBe('موجودی کافی نیست')

    expect(result.current.loading).toBe(false)

    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('should use default error when payment result has no error message', async () => {
    mockedRequestPaymentAction.mockResolvedValueOnce({
      success: false,
    })

    const { result } = renderHook(() => usePayment())

    let response

    await act(async () => {
      response = await result.current.initiatePayment(paymentInput)
    })

    expect(response).toEqual({
      success: false,
      error: 'Failed to initiate payment',
    })

    expect(result.current.error).toBe(
      'Failed to initiate payment',
    )

    expect(result.current.loading).toBe(false)

    expect(replaceMock).not.toHaveBeenCalled()
  })

  // =========================================================
  // Missing authority
  // =========================================================

  it('should fail when payment authority is missing', async () => {
    mockedRequestPaymentAction.mockResolvedValueOnce({
      success: true,
      authority: undefined,
      paymentUrl: paymentResult.paymentUrl,
    })

    const { result } = renderHook(() => usePayment())

    let response

    await act(async () => {
      response = await result.current.initiatePayment(paymentInput)
    })

    expect(response).toEqual({
      success: false,
      error: 'No payment authority received',
    })

    expect(result.current.error).toBe(
      'No payment authority received',
    )

    expect(result.current.loading).toBe(false)

    expect(replaceMock).not.toHaveBeenCalled()
  })

  // =========================================================
  // Missing payment URL
  // =========================================================

  it('should fail when payment URL is missing', async () => {
    mockedRequestPaymentAction.mockResolvedValueOnce({
      success: true,
      authority: paymentResult.authority,
      paymentUrl: undefined,
    })

    const { result } = renderHook(() => usePayment())

    let response

    await act(async () => {
      response = await result.current.initiatePayment(paymentInput)
    })

    expect(response).toEqual({
      success: false,
      error: 'No payment URL received',
    })

    expect(result.current.error).toBe(
      'No payment URL received',
    )

    expect(result.current.loading).toBe(false)

    expect(replaceMock).not.toHaveBeenCalled()
  })

  // =========================================================
  // Unexpected error
  // =========================================================

  it('should handle unexpected errors from requestPaymentAction', async () => {
    mockedRequestPaymentAction.mockRejectedValueOnce(
      new Error('Network error'),
    )

    const { result } = renderHook(() => usePayment())

    let response

    await act(async () => {
      response = await result.current.initiatePayment(paymentInput)
    })

    expect(response).toEqual({
      success: false,
      error: 'Network error',
    })

    expect(result.current.error).toBe('Network error')

    expect(result.current.loading).toBe(false)

    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('should use default unexpected error message when thrown value has no message', async () => {
    mockedRequestPaymentAction.mockRejectedValueOnce({})

    const { result } = renderHook(() => usePayment())

    let response

    await act(async () => {
      response = await result.current.initiatePayment(paymentInput)
    })

    expect(response).toEqual({
      success: false,
      error: 'An unexpected error occurred',
    })

    expect(result.current.error).toBe(
      'An unexpected error occurred',
    )

    expect(result.current.loading).toBe(false)

    expect(replaceMock).not.toHaveBeenCalled()
  })

  // =========================================================
  // Error state reset
  // =========================================================

  it('should clear previous error when a new payment starts', async () => {
    mockedRequestPaymentAction
      .mockResolvedValueOnce({
        success: false,
        error: 'First payment failed',
      })
      .mockResolvedValueOnce(paymentResult)

    const { result } = renderHook(() => usePayment())

    await act(async () => {
      await result.current.initiatePayment(paymentInput)
    })

    expect(result.current.error).toBe('First payment failed')

    await act(async () => {
      await result.current.initiatePayment(paymentInput)
    })

    expect(result.current.error).toBeNull()

    expect(replaceMock).toHaveBeenCalledWith(
      paymentResult.paymentUrl,
    )
  })

  // =========================================================
  // Request input
  // =========================================================

  it('should pass the exact payment input to requestPaymentAction', async () => {
    mockedRequestPaymentAction.mockResolvedValueOnce(paymentResult)

    const { result } = renderHook(() => usePayment())

    await act(async () => {
      await result.current.initiatePayment(paymentInput)
    })

    expect(mockedRequestPaymentAction).toHaveBeenCalledTimes(1)

    expect(mockedRequestPaymentAction).toHaveBeenCalledWith(
      paymentInput,
    )
  })

  // =========================================================
  // Redirect protection
  // =========================================================

  it('should not redirect when payment initiation fails', async () => {
    mockedRequestPaymentAction.mockResolvedValueOnce({
      success: false,
      error: 'Payment failed',
    })

    const { result } = renderHook(() => usePayment())

    await act(async () => {
      await result.current.initiatePayment(paymentInput)
    })

    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('should not redirect when authority is missing', async () => {
    mockedRequestPaymentAction.mockResolvedValueOnce({
      success: true,
      authority: '',
      paymentUrl: paymentResult.paymentUrl,
    })

    const { result } = renderHook(() => usePayment())

    await act(async () => {
      await result.current.initiatePayment(paymentInput)
    })

    expect(replaceMock).not.toHaveBeenCalled()
  })

  it('should not redirect when payment URL is missing', async () => {
    mockedRequestPaymentAction.mockResolvedValueOnce({
      success: true,
      authority: paymentResult.authority,
      paymentUrl: '',
    })

    const { result } = renderHook(() => usePayment())

    await act(async () => {
      await result.current.initiatePayment(paymentInput)
    })

    expect(replaceMock).not.toHaveBeenCalled()
  })
})