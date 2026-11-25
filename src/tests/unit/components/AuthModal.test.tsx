// @vitest-environment jsdom

import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Don't mock isInternalUrl - use the real implementation
// The real isInternalUrl returns false for URLs that don't start with '/' or start with '//'
// This allows us to test the fallback behavior without mocking issues

import AuthModal from '@/components/layout/AuthModal'

const DEFAULT_TITLE = 'ورود یا ثبت‌نام برای ادامه'
const DEFAULT_DESCRIPTION =
  'برای ادامه خرید باید حساب کاربری بسازید یا وارد شوید. سبد خرید شما حفظ می‌شود.'

const getCloseButton = () => screen.getByRole('button', { name: 'بستن' })
const getLoginLink = () => screen.getByRole('link', { name: 'ورود' })
const getRegisterLink = () => screen.getByRole('link', { name: 'ثبت‌نام' })

describe('AuthModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when isOpen is false', () => {
    render(<AuthModal isOpen={false} onClose={vi.fn()} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders modal with custom title and description when open', () => {
    render(
      <AuthModal
        isOpen={true}
        onClose={vi.fn()}
        title="Custom Title"
        description="Custom Description"
      />,
    )

    expect(screen.getByText('Custom Title')).toBeInTheDocument()
    expect(screen.getByText('Custom Description')).toBeInTheDocument()
  })

  it('renders default title and description when not provided', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    expect(screen.getByText(DEFAULT_TITLE)).toBeInTheDocument()
    expect(screen.getByText(DEFAULT_DESCRIPTION)).toBeInTheDocument()
  })

  it('exposes an accessible dialog with a name and description', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    const dialog = screen.getByRole('dialog', { name: DEFAULT_TITLE })

    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveAccessibleDescription(DEFAULT_DESCRIPTION)
  })

  it('renders login and register links with correct callbackUrl', () => {
    render(
      <AuthModal isOpen={true} onClose={vi.fn()} callbackUrl="/checkout" />,
    )

    expect(getLoginLink()).toHaveAttribute(
      'href',
      '/auth?callbackUrl=%2Fcheckout',
    )
    expect(getRegisterLink()).toHaveAttribute(
      'href',
      '/auth?callbackUrl=%2Fcheckout',
    )
  })

  it.each([
    ['http URL', 'http://evil.com'],
    ['protocol-relative URL', '//evil.com'],
  ])('uses fallback "/" for invalid callbackUrl (%s)', (_, callbackUrl) => {
    render(
      <AuthModal isOpen={true} onClose={vi.fn()} callbackUrl={callbackUrl} />,
    )

    expect(getLoginLink()).toHaveAttribute('href', '/auth?callbackUrl=%2F')
    expect(getRegisterLink()).toHaveAttribute('href', '/auth?callbackUrl=%2F')
  })

  it('moves focus to the close button when opened', async () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} />)

    await waitFor(() => expect(getCloseButton()).toHaveFocus())
  })

  it('closes modal when close button is clicked', async () => {
    const onClose = vi.fn()
    render(<AuthModal isOpen={true} onClose={onClose} />)

    await userEvent.click(getCloseButton())

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes modal when backdrop is clicked', () => {
    const onClose = vi.fn()
    const { container } = render(<AuthModal isOpen={true} onClose={onClose} />)

    const backdrop = container.querySelector('.auth-modal-backdrop')
    expect(backdrop).toBeInTheDocument()
    fireEvent.click(backdrop!)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes modal when continue as guest is clicked', async () => {
    const onClose = vi.fn()
    render(<AuthModal isOpen={true} onClose={onClose} />)

    await userEvent.click(
      screen.getByRole('button', { name: 'ادامه به عنوان مهمان' }),
    )

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('closes modal on Escape key', () => {
    const onClose = vi.fn()
    render(<AuthModal isOpen={true} onClose={onClose} />)

    fireEvent.keyDown(document, { key: 'Escape' })

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not close when clicking inside modal content', () => {
    const onClose = vi.fn()
    render(<AuthModal isOpen={true} onClose={onClose} />)

    fireEvent.click(screen.getByText(DEFAULT_TITLE))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('handles login link click', async () => {
    const onClose = vi.fn()
    render(<AuthModal isOpen={true} onClose={onClose} callbackUrl="/order" />)

    await userEvent.click(getLoginLink())

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('handles register link click', async () => {
    const onClose = vi.fn()
    render(<AuthModal isOpen={true} onClose={onClose} callbackUrl="/order" />)

    await userEvent.click(getRegisterLink())

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('locks body scroll while open and restores it on close', () => {
    const onClose = vi.fn()
    const { rerender } = render(<AuthModal isOpen={true} onClose={onClose} />)

    expect(document.body.style.overflow).toBe('hidden')

    rerender(<AuthModal isOpen={false} onClose={onClose} />)

    expect(document.body.style.overflow).toBe('unset')
  })
})
