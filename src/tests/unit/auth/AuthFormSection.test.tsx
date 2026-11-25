// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ComponentProps } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requestOtpMock, verifyOtpMock } = vi.hoisted(() => ({
  requestOtpMock: vi.fn(),
  verifyOtpMock: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: (props: ComponentProps<'img'>) => <img {...props} />,
}))

vi.mock('@/components/layout/InformPopup', () => ({
  default: () => null,
}))

vi.mock('@/features/auth/actions/requestOtpAction', () => ({
  requestOtp: requestOtpMock,
}))

vi.mock('@/features/auth/actions/verifyOtpAction', () => ({
  verifyOtp: verifyOtpMock,
}))

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(() => new URLSearchParams()),
}))

import AuthFormSection from '@/components/domain/auth/AuthFormSection'

describe('AuthFormSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    requestOtpMock.mockResolvedValue({ success: true })
    verifyOtpMock.mockResolvedValue({ success: true })
  })

  it('requires an identifier before requesting a code', () => {
    render(<AuthFormSection />)

    const button = screen.getByRole('button', { name: 'دریافت کد ورود' })
    expect(button instanceof HTMLButtonElement && button.disabled).toBe(true)
  })

  it('normalizes Persian and Arabic digits for the identifier and OTP', async () => {
    const user = userEvent.setup()
    render(<AuthFormSection />)

    fireEvent.change(
      screen.getByRole('textbox', { name: 'ایمیل یا شماره تلفن' }),
      {
        target: { value: '۰۹۱۲۳۴۵۶۷۸۹' },
      },
    )
    await user.click(screen.getByRole('button', { name: 'دریافت کد ورود' }))

    await waitFor(() => {
      expect(requestOtpMock).toHaveBeenCalledWith({
        identifier: '09123456789',
      })
    })

    const otpInput = await screen.findByRole('textbox', {
      name: 'کد تأیید شش رقمی',
    })
    fireEvent.change(otpInput, { target: { value: '١٢٣٤٥٦' } })
    await user.click(screen.getByRole('button', { name: 'تأیید و ورود' }))

    await waitFor(() => {
      expect(verifyOtpMock).toHaveBeenCalledWith({
        identifier: '09123456789',
        code: '123456',
        callbackUrl: '/',
      })
    })
  })

  it('does not verify an incomplete code', async () => {
    const user = userEvent.setup()
    render(<AuthFormSection />)

    fireEvent.change(
      screen.getByRole('textbox', { name: 'ایمیل یا شماره تلفن' }),
      {
        target: { value: 'user@gmail.com' },
      },
    )
    await user.click(screen.getByRole('button', { name: 'دریافت کد ورود' }))

    const otpInput = await screen.findByRole('textbox', {
      name: 'کد تأیید شش رقمی',
    })
    fireEvent.change(otpInput, { target: { value: '123' } })

    const button = screen.getByRole('button', { name: 'تأیید و ورود' })
    expect(button instanceof HTMLButtonElement && button.disabled).toBe(true)
    expect(verifyOtpMock).not.toHaveBeenCalled()
  })
})
