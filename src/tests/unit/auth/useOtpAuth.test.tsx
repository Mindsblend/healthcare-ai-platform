// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { requestOtpMock, verifyOtpMock } = vi.hoisted(() => ({
  requestOtpMock: vi.fn(),
  verifyOtpMock: vi.fn(),
}))

vi.mock('@/features/auth/actions/requestOtpAction', () => ({
  requestOtp: requestOtpMock,
}))

vi.mock('@/features/auth/actions/verifyOtpAction', () => ({
  verifyOtp: verifyOtpMock,
}))

import { useOtpAuth } from '@/features/auth/hooks/useOtpAuth'
import { ErrorCode } from '@/lib/errors'

describe('useOtpAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestOtpMock.mockResolvedValue({ success: true })
    verifyOtpMock.mockResolvedValue({ success: true })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('requests a code and starts the resend cooldown after success', async () => {
    const { result } = renderHook(() => useOtpAuth())

    await act(async () => {
      await result.current.handleOtpButton('user@gmail.com', '')
    })

    expect(requestOtpMock).toHaveBeenCalledWith({
      identifier: 'user@gmail.com',
    })
    expect(result.current.stage).toBe('sent')
    expect(result.current.resendCountdown).toBe(30)
    expect(result.current.error).toBeNull()
  })

  it('shows the matching user-facing error when sending is rate limited', async () => {
    requestOtpMock.mockRejectedValue(new Error(ErrorCode.OTP_RATE_LIMIT.code))
    const { result } = renderHook(() => useOtpAuth())

    await act(async () => {
      await result.current.handleOtpButton('user@gmail.com', '')
    })

    expect(result.current.stage).toBe('idle')
    expect(result.current.error).toBe(ErrorCode.OTP_RATE_LIMIT.message)
    expect(result.current.loading).toBe(false)
  })

  it('verifies a six-digit code and enters the verified stage', async () => {
    const { result } = renderHook(() => useOtpAuth())

    await act(async () => {
      await result.current.handleOtpButton('user@gmail.com', '')
    })
    await act(async () => {
      await result.current.handleOtpButton('user@gmail.com', '123456')
    })

    expect(verifyOtpMock).toHaveBeenCalledWith({
      identifier: 'user@gmail.com',
      code: '123456',
    })
    expect(result.current.stage).toBe('verified')
    expect(result.current.loading).toBe(false)
  })

  it('allows resending only after the cooldown has elapsed', async () => {
    vi.useFakeTimers()
    const { result } = renderHook(() => useOtpAuth())

    await act(async () => {
      await result.current.handleOtpButton('user@gmail.com', '')
    })
    await act(async () => {
      await result.current.resendCode('user@gmail.com')
    })
    expect(requestOtpMock).toHaveBeenCalledOnce()

    for (let second = 0; second < 30; second += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })
    }
    expect(result.current.resendCountdown).toBe(0)

    await act(async () => {
      await result.current.resendCode('user@gmail.com')
    })
    expect(requestOtpMock).toHaveBeenCalledTimes(2)
    expect(result.current.resendCountdown).toBe(30)
  })

  it('resets the stage, countdown, and error when editing the identifier', async () => {
    requestOtpMock.mockRejectedValueOnce(
      new Error(ErrorCode.OTP_RATE_LIMIT.code),
    )
    const { result } = renderHook(() => useOtpAuth())

    await act(async () => {
      await result.current.handleOtpButton('user@gmail.com', '')
    })
    act(() => result.current.reset())

    expect(result.current.stage).toBe('idle')
    expect(result.current.resendCountdown).toBe(0)
    expect(result.current.error).toBeNull()
  })
})
