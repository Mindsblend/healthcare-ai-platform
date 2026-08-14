import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import Product from '@/components/layout/Product'
import { useCart } from '@/features/shop/hooks/cart/useCart'
import { useRouter } from 'next/navigation'

vi.mock('@/features/shop/hooks/cart/useCart', () => ({
  useCart: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return <img {...props} />
  },
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
  }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    )
  },
}))

describe('Product', () => {
  const addToCart = vi.fn()
  const push = vi.fn()

  const product = {
    id: 'product-1',
    title: 'Test Product',
    slug: 'test-product',
    price: 100000,
    solution: 'Test solution',
    image: '/images/product.webp',
    category: {
      iconPath: '/images/category.webp',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useCart).mockReturnValue({
      addToCart,
      isAuthenticated: true,
    } as any)

    vi.mocked(useRouter).mockReturnValue({
      push,
    } as any)
  })

  it('should render product information', () => {
    render(<Product product={product} />)

    expect(screen.getByText('Test Product')).toBeInTheDocument()

    expect(screen.getByText('Test solution')).toBeInTheDocument()

    expect(screen.getAllByText(/تومان/).length).toBeGreaterThan(0)
  })

  it('should add product to cart when authenticated', async () => {
    const user = userEvent.setup()

    render(<Product product={product} />)

    const buttons = screen.getAllByRole('button', {
      name: 'افزودن Test Product به سبد خرید',
    })

    await user.click(buttons[0])

    expect(addToCart).toHaveBeenCalledWith('product-1', 1)
  })

  it('should redirect to auth when user is not authenticated', async () => {
    const user = userEvent.setup()

    vi.mocked(useCart).mockReturnValue({
      addToCart,
      isAuthenticated: false,
    } as any)

    render(<Product product={product} />)

    const buttons = screen.getAllByRole('button', {
      name: 'افزودن Test Product به سبد خرید',
    })

    await user.click(buttons[0])

    expect(push).toHaveBeenCalledWith('/auth?from=%2Fproducts')

    expect(addToCart).not.toHaveBeenCalled()
  })

  it('should show loading state while adding product to cart', async () => {
    const user = userEvent.setup()

    let resolveAddToCart!: () => void

    const pendingAddToCart = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAddToCart = resolve
        }),
    )

    vi.mocked(useCart).mockReturnValue({
      addToCart: pendingAddToCart,
      isAuthenticated: true,
    } as any)

    render(<Product product={product} />)

    const button = screen.getAllByRole('button', {
      name: 'افزودن Test Product به سبد خرید',
    })[0]

    // قبل از کلیک
    expect(button).toBeEnabled()

    // شروع درخواست
    await user.click(button)

    // Loading باید نمایش داده شود
    expect(screen.getAllByText('در حال افزودن...').length).toBeGreaterThan(0)

    // دکمه باید disabled شود
    expect(button).toBeDisabled()

    // addToCart فقط یک بار اجرا شده باشد
    expect(pendingAddToCart).toHaveBeenCalledTimes(1)

    // کلیک مجدد نباید درخواست دوم ایجاد کند
    await user.click(button)

    expect(pendingAddToCart).toHaveBeenCalledTimes(1)

    // درخواست را resolve می‌کنیم
    resolveAddToCart()

    // بعد از اتمام درخواست، دکمه باید دوباره فعال شود
    await vi.waitFor(() => {
      expect(button).toBeEnabled()
    })

    // متن Loading باید دیگر وجود نداشته باشد
    expect(screen.queryByText('در حال افزودن...')).not.toBeInTheDocument()
  })
})
