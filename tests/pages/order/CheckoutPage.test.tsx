import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { describe, expect, it, vi, beforeEach } from 'vitest'

import CheckoutPage from '@/app/order/page'

import { useCart } from '@/features/shop/hooks/cart/useCart'
import { useCreateOrder } from '@/features/shop/hooks/orders/createOrders'
import { usePayment } from '@/features/shop/hooks/payment/usePayment'
import { useUserAddress } from '@/features/shop/hooks/profile/useUserAddress'
import { useCreateUserAddress } from '@/features/shop/hooks/profile/createUserAddress'
import { useUpdateUserProfile } from '@/features/shop/hooks/profile/updateUserProfile'

vi.mock('@/features/shop/hooks/cart/useCart', () => ({
  useCart: vi.fn(),
}))

vi.mock('@/features/shop/hooks/orders/createOrders', () => ({
  useCreateOrder: vi.fn(),
}))

vi.mock('@/features/shop/hooks/payment/usePayment', () => ({
  usePayment: vi.fn(),
}))

vi.mock('@/features/shop/hooks/profile/useUserAddress', () => ({
  useUserAddress: vi.fn(),
}))

vi.mock('@/features/shop/hooks/profile/createUserAddress', () => ({
  useCreateUserAddress: vi.fn(),
}))

vi.mock('@/features/shop/hooks/profile/updateUserProfile', () => ({
  useUpdateUserProfile: vi.fn(),
}))

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}))

vi.mock('@/components/layout/LoadingBar', () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

vi.mock('@/components/layout/InformPopup', () => ({
  default: () => null,
}))

describe('CheckoutPage payment flow', () => {
  const waitForCartSyncMock = vi.fn()
  const createOrderMock = vi.fn()
  const initiatePaymentMock = vi.fn()
  const createUserAddressMock = vi.fn()
  const updateUserProfileMock = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(useCart).mockReturnValue({
      cart: null,
      cartItems: [
        {
          id: 1,
          cartId: 'cart-1',
          quantity: 5,
          price: 500000,
          product: {
            id: 10,
            title: 'Product A',
            price: 500000,
            solution: 'Solution',
            slug: 'product-a',
            image: '',
            categoryId: 1,
            category: null,
          },
        },
      ],
      loading: false,
      error: null,
      isAdding: false,
      isSyncing: false,
      isAuthenticated: true,
      addToCart: vi.fn(),
      removeFromCart: vi.fn(),
      updateQuantity: vi.fn(),
      refreshCart: vi.fn(),
      waitForCartSync: waitForCartSyncMock,
    })

    vi.mocked(useCreateOrder).mockReturnValue({
      createOrder: createOrderMock,
      loading: false,
      error: null,
      data: null,
    })

    vi.mocked(usePayment).mockReturnValue({
      initiatePayment: initiatePaymentMock,
      loading: false,
      error: null,
    } as any)

    vi.mocked(useUserAddress).mockReturnValue({
      userAddress: {
        addresses: [
          {
            id: 'address-1',
            isDefault: true,
            firstName: 'Kian',
            lastName: 'User',
            city: 'Tehran',
            province: 'Tehran',
            email: 'test@example.com',
            phone: '09120000000',
            address: 'Test Address',
            postalCode: '1234567890',
          },
        ],
      },
      loading: false,
      error: null,
    } as any)

    vi.mocked(useCreateUserAddress).mockReturnValue({
      createUserAddress: createUserAddressMock,
      loading: false,
      error: null,
    } as any)

    vi.mocked(useUpdateUserProfile).mockReturnValue({
      updateUserProfile: updateUserProfileMock,
      loading: false,
      error: null,
    } as any)

    createOrderMock.mockResolvedValue({
      id: 'order-1',
      userId: 'user-1',
      cartId: 'cart-1',
      totalPrice: 3566461,
      status: 'PENDING',
    })

    initiatePaymentMock.mockResolvedValue({
      success: true,
      authority: 'AUTH-123',
      paymentUrl: 'https://payment.test',
    })

    waitForCartSyncMock.mockResolvedValue(undefined)
  })

  it('should wait for cart synchronization before creating the order', async () => {
    const user = userEvent.setup()

    const executionOrder: string[] = []

    waitForCartSyncMock.mockImplementation(async () => {
      executionOrder.push('sync')
    })

    createOrderMock.mockImplementation(async () => {
      executionOrder.push('order')

      return {
        id: 'order-1',
        userId: 'user-1',
        cartId: 'cart-1',
        totalPrice: 3566461,
        status: 'PENDING',
      }
    })

    initiatePaymentMock.mockImplementation(async () => {
      executionOrder.push('payment')

      return {
        success: true,
        authority: 'AUTH-123',
        paymentUrl: 'https://payment.test',
      }
    })

    render(<CheckoutPage />)

    const button = await screen.findByRole('button', {
      name: /ثبت سفارش و پرداخت/,
    })

    await user.click(button)

    await waitFor(() => {
      expect(createOrderMock).toHaveBeenCalled()
    })

    expect(executionOrder).toEqual(['sync', 'order', 'payment'])
  })

  it('should use order total as payment amount', async () => {
    const user = userEvent.setup()

    render(<CheckoutPage />)

    const button = await screen.findByRole('button', {
      name: /ثبت سفارش و پرداخت/,
    })

    await user.click(button)

    await waitFor(() => {
      expect(initiatePaymentMock).toHaveBeenCalled()
    })

    expect(initiatePaymentMock).toHaveBeenCalledWith({
      amount: 3566461,
      description: 'سفارش شماره order-1',
      orderId: 'order-1',
      email: expect.any(String),
      mobile: expect.any(String),
    })
  })

  it('should not calculate payment amount from cart items', async () => {
    const user = userEvent.setup()

    // Cart total intentionally differs from Order total.
    // This proves Payment must use Order.totalPrice.
    vi.mocked(useCart).mockReturnValue({
      ...(useCart as any),
    })

    render(<CheckoutPage />)

    const button = await screen.findByRole('button', {
      name: /ثبت سفارش و پرداخت/,
    })

    await user.click(button)

    await waitFor(() => {
      expect(initiatePaymentMock).toHaveBeenCalled()
    })

    const paymentCall = initiatePaymentMock.mock.calls[0][0]

    expect(paymentCall.amount).toBe(3566461)
    expect(paymentCall.amount).not.toBe(5 * 500000)
  })

  it('should not start payment when order creation fails', async () => {
    const user = userEvent.setup()

    createOrderMock.mockRejectedValue(new Error('Failed to create order'))

    render(<CheckoutPage />)

    const button = await screen.findByRole('button', {
      name: /ثبت سفارش و پرداخت/,
    })

    await user.click(button)

    await waitFor(() => {
      expect(createOrderMock).toHaveBeenCalled()
    })

    expect(initiatePaymentMock).not.toHaveBeenCalled()
  })

  it('should not start payment when cart synchronization fails', async () => {
    const user = userEvent.setup()

    waitForCartSyncMock.mockRejectedValue(
      new Error('Cart synchronization failed'),
    )

    render(<CheckoutPage />)

    const button = await screen.findByRole('button', {
      name: /ثبت سفارش و پرداخت/,
    })

    await user.click(button)

    await waitFor(() => {
      expect(waitForCartSyncMock).toHaveBeenCalled()
    })

    expect(createOrderMock).not.toHaveBeenCalled()
    expect(initiatePaymentMock).not.toHaveBeenCalled()
  })
})
