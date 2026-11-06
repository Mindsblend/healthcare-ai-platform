'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import type { ChangeEvent, FocusEvent } from 'react'

import { useCart } from '@/features/shop/hooks/cart/useCart'
import { useCreateOrder } from '@/features/shop/hooks/orders/createOrders'
import { useUserAddress } from '@/features/shop/hooks/profile/useUserAddress'
import { useCreateUserAddress } from '@/features/shop/hooks/profile/createUserAddress'
import { useUpdateUserProfile } from '@/features/shop/hooks/profile/updateUserProfile'
import { usePayment } from '@/features/shop/hooks/payment/usePayment'

import type { ShippingInfo, Address } from '@/features/shop/shop.types'
import type { City } from '@/components/types/types'

import {
  getFreeShippingStatus,
  provinces,
  getCitiesByProvince,
  validateFirstName,
  validateLastName,
  validateProvince,
  validateCity,
  validateAddress,
  validatePostalCode,
  validateShippingInfo,
  getValidationErrorsObject,
  validateIdentifierField,
  toPersianDigit,
} from '@/lib/helpers'

import LoadingBar from '@/components/layout/LoadingBar'
import InformPopup from '@/components/layout/InformPopup'

// ============================================================
// Constants
// ============================================================

const TAX_RATE = 0.09
const FREE_SHIPPING_THRESHOLD = 2_000_000
const SHIPPING_COST = 300_000

const PAYMENT_METHOD = 'zarinpal' as const

// ============================================================
// Types
// ============================================================

type FieldErrors = Record<string, string>
type TouchedFields = Record<string, boolean>

type ProductPriceInfo = {
  originalPrice: number
  finalPrice: number
  hasDiscount: boolean
  discountAmount: number
  discountPercent: number
}

// ============================================================
// Helpers
// ============================================================

const formatPrice = (value: number) => value.toLocaleString('fa-IR')

const getItemPrices = (item: {
  product: {
    price?: number | null
    discountedPrice?: number | null
  }
}): ProductPriceInfo => {
  const originalPrice = Math.max(0, item.product.price ?? 0)

  const discountedPrice = item.product.discountedPrice

  const hasDiscount =
    typeof discountedPrice === 'number' &&
    Number.isFinite(discountedPrice) &&
    discountedPrice >= 0 &&
    discountedPrice < originalPrice

  const finalPrice = hasDiscount ? discountedPrice : originalPrice

  const discountAmount = originalPrice - finalPrice

  const discountPercent =
    originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0

  return {
    originalPrice,
    finalPrice,
    hasDiscount,
    discountAmount,
    discountPercent,
  }
}

// ============================================================
// Initial State
// ============================================================

const INITIAL_SHIPPING_INFO: ShippingInfo = {
  firstName: '',
  lastName: '',
  city: '',
  province: '',
  email: '',
  phone: '',
  address: '',
  postalCode: '',
  notes: '',
}

// ============================================================
// Component
// ============================================================

const CheckoutPage = () => {
  // ----------------------------------------------------------
  // Hooks
  // ----------------------------------------------------------

  const {
    cartItems,
    loading: cartLoading,
    error: cartError,
    waitForCartSync,
  } = useCart()

  const { createOrder, loading: orderLoading } = useCreateOrder()

  const { createUserAddress } = useCreateUserAddress()

  const { userAddress } = useUserAddress()

  const { updateUserProfile } = useUpdateUserProfile()

  const { initiatePayment, loading: paymentLoading } = usePayment()

  // ----------------------------------------------------------
  // State
  // ----------------------------------------------------------

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  )

  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(
    INITIAL_SHIPPING_INFO,
  )

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [touchedFields, setTouchedFields] = useState<TouchedFields>({})

  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // ----------------------------------------------------------
  // Derived State
  // ----------------------------------------------------------

  const hasSavedAddresses = Boolean(userAddress?.addresses?.length)

  const availableCities: City[] = useMemo(() => {
    if (!shippingInfo.province) return []

    return getCitiesByProvince(shippingInfo.province)
  }, [shippingInfo.province])

  // ----------------------------------------------------------
  // Cart Calculations
  // ----------------------------------------------------------

  const cartSummary = useMemo(() => {
    const itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

    const originalTotal = cartItems.reduce((sum, item) => {
      const { originalPrice } = getItemPrices(item)

      return sum + originalPrice * item.quantity
    }, 0)

    const subtotal = cartItems.reduce((sum, item) => {
      const { finalPrice } = getItemPrices(item)

      return sum + finalPrice * item.quantity
    }, 0)

    const savings = originalTotal - subtotal

    const savingsPercent =
      originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0

    return {
      itemsCount,
      originalTotal,
      subtotal,
      savings,
      savingsPercent,
    }
  }, [cartItems])

  // ----------------------------------------------------------
  // Tax Calculations
  // ----------------------------------------------------------

  const taxAmount = useMemo(
    () => Math.round(cartSummary.subtotal * TAX_RATE),
    [cartSummary.subtotal],
  )

  // ----------------------------------------------------------
  // Shipping Calculations
  // ----------------------------------------------------------

  const isFreeShipping = useMemo(
    () => getFreeShippingStatus(cartSummary.subtotal, FREE_SHIPPING_THRESHOLD),
    [cartSummary.subtotal],
  )

  const deliveryAmount = isFreeShipping ? 0 : SHIPPING_COST

  // ----------------------------------------------------------
  // Final Amount
  // ----------------------------------------------------------

  const totalAmount = cartSummary.subtotal + taxAmount

  const finalAmount = totalAmount + deliveryAmount

  // ----------------------------------------------------------
  // Address Management
  // ----------------------------------------------------------

  useEffect(() => {
    if (
      !userAddress?.addresses?.length ||
      isAddingNewAddress ||
      selectedAddressId
    ) {
      return
    }

    const defaultAddress = userAddress.addresses.find(
      (address: Address) => address.isDefault,
    )

    const addressToSelect = defaultAddress || userAddress.addresses[0]

    if (!addressToSelect) return

    setSelectedAddressId(addressToSelect.id)

    setShippingInfo((prev) => ({
      ...prev,
      firstName: addressToSelect.firstName,
      lastName: addressToSelect.lastName,
      city: addressToSelect.city,
      province: addressToSelect.province,
      email: addressToSelect.email || '',
      phone: addressToSelect.phone,
      address: addressToSelect.address,
      postalCode: addressToSelect.postalCode,
    }))
  }, [userAddress, isAddingNewAddress, selectedAddressId])

  // ----------------------------------------------------------
  // Address Selection
  // ----------------------------------------------------------

  const handleSelectAddress = (address: Address) => {
    setSelectedAddressId(address.id)

    setShippingInfo((prev) => ({
      ...prev,
      firstName: address.firstName,
      lastName: address.lastName,
      city: address.city,
      province: address.province,
      email: address.email || '',
      phone: address.phone,
      address: address.address,
      postalCode: address.postalCode,
    }))

    setFieldErrors({})
    setTouchedFields({})
  }

  const handleAddNewAddress = () => {
    setIsAddingNewAddress(true)
    setSelectedAddressId(null)
    setShippingInfo(INITIAL_SHIPPING_INFO)
    setFieldErrors({})
    setTouchedFields({})
  }

  const handleCancelNewAddress = () => {
    setIsAddingNewAddress(false)
    setFieldErrors({})
    setTouchedFields({})
  }

  // ----------------------------------------------------------
  // Field Changes
  // ----------------------------------------------------------

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target

    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  const handleProvinceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target

    setShippingInfo((prev) => ({
      ...prev,
      province: value,
      city: '',
    }))

    setFieldErrors((prev) => ({
      ...prev,
      province: '',
      city: '',
    }))

    setTouchedFields((prev) => ({
      ...prev,
      province: true,
      city: false,
    }))
  }

  const handleCityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target

    setShippingInfo((prev) => ({
      ...prev,
      city: value,
    }))

    setFieldErrors((prev) => ({
      ...prev,
      city: '',
    }))

    setTouchedFields((prev) => ({
      ...prev,
      city: true,
    }))
  }

  // ----------------------------------------------------------
  // Field Validation
  // ----------------------------------------------------------

  const handleBlur = async (
    e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target

    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }))

    let error: string | null = null

    switch (name) {
      case 'firstName':
        error = validateFirstName(value)?.message || null
        break

      case 'lastName':
        error = validateLastName(value)?.message || null
        break

      case 'email':
      case 'phone': {
        const validation = await validateIdentifierField(value)

        error = validation.isValid ? null : validation.error || null

        break
      }

      case 'province':
        error = validateProvince(value, provinces)?.message || null
        break

      case 'city':
        error =
          validateCity(value, shippingInfo.province, getCitiesByProvince)
            ?.message || null
        break

      case 'address':
        error = validateAddress(value)?.message || null
        break

      case 'postalCode':
        error = validatePostalCode(value)?.message || null
        break

      default:
        break
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: error || '',
    }))
  }

  // ----------------------------------------------------------
  // Checkout Submission
  // ----------------------------------------------------------
  const [isCheckoutSubmitting, setIsCheckoutSubmitting] = useState(false)

  const checkoutLockRef = useRef(false)

  const isSubmitting = isCheckoutSubmitting || orderLoading || paymentLoading

  const handleSubmit = async () => {
    // Prevent duplicate submissions, including rapid clicks
    if (checkoutLockRef.current || isSubmitting || cartItems.length === 0) {
      return
    }

    checkoutLockRef.current = true
    setIsCheckoutSubmitting(true)
    setErrorMessage(null)

    try {
      // 1. Mark all fields as touched
      const allTouched = Object.keys(shippingInfo).reduce((acc, key) => {
        acc[key] = true
        return acc
      }, {} as TouchedFields)

      setTouchedFields(allTouched)

      // 2. Validate shipping information
      const validation = await validateShippingInfo(
        shippingInfo,
        provinces,
        getCitiesByProvince,
      )

      if (!validation.isValid) {
        const errors = getValidationErrorsObject(validation.errors)

        setFieldErrors(errors)

        const firstErrorField = validation.errors[0]?.field

        if (firstErrorField) {
          document
            .querySelector(`[name="${firstErrorField}"]`)
            ?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            })
        }

        return
      }

      // 3. Wait for pending cart mutations
      await waitForCartSync()

      // 4. Update user profile if necessary
      if (!hasSavedAddresses) {
        await updateUserProfile({
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
        })
      }

      // 5. Create address if necessary
      if (!selectedAddressId) {
        await createUserAddress({
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          city: shippingInfo.city,
          province: shippingInfo.province,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          postalCode: shippingInfo.postalCode,
        })
      }

      // 6. Create order
      const orderResult = await createOrder({
        shippingInfo,
        paymentMethod: PAYMENT_METHOD,
      })

      if (!orderResult?.id) {
        throw new Error('خطا در ثبت سفارش')
      }

      // 7. Validate server-side order amount
      const orderTotal = Number(orderResult.totalPrice)

      if (!Number.isFinite(orderTotal) || orderTotal <= 0) {
        throw new Error('مبلغ سفارش معتبر نیست')
      }

      // 8. Initiate payment
      const paymentResult = await initiatePayment({
        amount: orderTotal,
        description: `سفارش شماره ${orderResult.id}`,
        orderId: orderResult.id,
        email: shippingInfo.email,
        mobile: shippingInfo.phone,
      })

      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'خطا در اتصال به درگاه پرداخت')
      }
    } catch (err) {
      console.error('Checkout error:', err)

      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'خطا در ثبت سفارش، لطفا دوباره تلاش کنید.',
      )
    } finally {
      // Release lock after the process finishes
      checkoutLockRef.current = false
      setIsCheckoutSubmitting(false)
    }
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <LoadingBar
      loading={cartLoading || paymentLoading || orderLoading}
      error={cartError}
    >
      <section className="container my-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {/* =================================================
              LEFT: Address / Checkout Form
          ================================================== */}

          <div className="col-span-1 xl:col-span-2">
            <div className="rounded-2xl border-2 border-[#D9D9D9] bg-white p-5 sm:p-8">
              {/* Address Selection */}

              {hasSavedAddresses && !isAddingNewAddress ? (
                <>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <h2 className="font-aria text-color-title-on-light text-right text-xl font-bold sm:text-2xl">
                      انتخاب آدرس ارسال
                    </h2>

                    <button
                      type="button"
                      onClick={handleAddNewAddress}
                      className="font-aria secondary-btn cursor-pointer rounded-[5px] bg-[#161A1D] px-4 text-sm font-bold text-white transition-all hover:bg-[#2A3035]"
                      style={{ height: '50px' }}
                    >
                      ثبت آدرس جدید
                    </button>
                  </div>

                  <div className="space-y-4">
                    {userAddress?.addresses?.map((address: Address) => (
                      <div
                        key={address.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelectAddress(address)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectAddress(address)
                          }
                        }}
                        className={`cursor-pointer rounded-lg transition hover:bg-gray-50 ${
                          selectedAddressId === address.id
                            ? 'border-2 border-black'
                            : 'border border-[#D9D9D9]'
                        }`}
                      >
                        <div className="p-5">
                          <div className="font-ray space-y-3 text-sm font-medium text-black sm:text-base">
                            {address.isDefault && (
                              <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                                آدرس پیش‌فرض
                              </span>
                            )}

                            <p className="font-bold">{address.address}</p>

                            <div className="flex flex-wrap gap-x-5 gap-y-2">
                              <span>شهر: {address.city}</span>

                              <span>استان: {address.province}</span>
                            </div>

                            <p>کد پستی: {toPersianDigit(address.postalCode)}</p>

                            <div className="flex flex-wrap gap-2">
                              <span>
                                گیرنده: {address.firstName} {address.lastName}
                              </span>

                              <span>| {toPersianDigit(address.phone)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* New Address Form */}

                  <div className="mb-6 flex items-center justify-between gap-3">
                    <h2 className="font-aria text-color-title-on-light text-xl font-bold sm:text-2xl">
                      اطلاعات خرید
                    </h2>

                    {hasSavedAddresses && (
                      <button
                        type="button"
                        onClick={handleCancelNewAddress}
                        className="font-ray rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold transition hover:bg-gray-100"
                      >
                        بازگشت به آدرس‌ها
                      </button>
                    )}
                  </div>

                  <form
                    className="grid grid-cols-1 gap-4 md:grid-cols-2"
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmit()
                    }}
                  >
                    {/* First Name */}

                    <div>
                      <input
                        name="firstName"
                        type="text"
                        placeholder="نام"
                        value={shippingInfo.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black ${
                          touchedFields.firstName && fieldErrors.firstName
                            ? 'border-2 border-red-500'
                            : ''
                        }`}
                      />

                      {touchedFields.firstName && fieldErrors.firstName && (
                        <p className="mt-1 text-right text-sm text-red-500">
                          {fieldErrors.firstName}
                        </p>
                      )}
                    </div>

                    {/* Last Name */}

                    <div>
                      <input
                        name="lastName"
                        type="text"
                        placeholder="نام خانوادگی"
                        value={shippingInfo.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black ${
                          touchedFields.lastName && fieldErrors.lastName
                            ? 'border-2 border-red-500'
                            : ''
                        }`}
                      />

                      {touchedFields.lastName && fieldErrors.lastName && (
                        <p className="mt-1 text-right text-sm text-red-500">
                          {fieldErrors.lastName}
                        </p>
                      )}
                    </div>

                    {/* Province */}

                    <div>
                      <select
                        name="province"
                        value={shippingInfo.province}
                        onChange={handleProvinceChange}
                        onBlur={handleBlur}
                        className={`font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black ${
                          touchedFields.province && fieldErrors.province
                            ? 'border-2 border-red-500'
                            : ''
                        }`}
                      >
                        <option value="">انتخاب استان</option>

                        {provinces.map((province) => (
                          <option key={province.id} value={province.name}>
                            {province.name}
                          </option>
                        ))}
                      </select>

                      {touchedFields.province && fieldErrors.province && (
                        <p className="mt-1 text-right text-sm text-red-500">
                          {fieldErrors.province}
                        </p>
                      )}
                    </div>

                    {/* City */}

                    <div>
                      <select
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleCityChange}
                        onBlur={handleBlur}
                        disabled={!shippingInfo.province}
                        className={`font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black disabled:cursor-not-allowed disabled:opacity-50 ${
                          touchedFields.city && fieldErrors.city
                            ? 'border-2 border-red-500'
                            : ''
                        }`}
                      >
                        <option value="">
                          {shippingInfo.province
                            ? 'انتخاب شهر'
                            : 'ابتدا استان را انتخاب کنید'}
                        </option>

                        {availableCities.map((city) => (
                          <option key={city.id} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>

                      {touchedFields.city && fieldErrors.city && (
                        <p className="mt-1 text-right text-sm text-red-500">
                          {fieldErrors.city}
                        </p>
                      )}
                    </div>

                    {/* Email */}

                    <div>
                      <input
                        name="email"
                        type="email"
                        placeholder="ایمیل"
                        value={shippingInfo.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black ${
                          touchedFields.email && fieldErrors.email
                            ? 'border-2 border-red-500'
                            : ''
                        }`}
                      />

                      {touchedFields.email && fieldErrors.email && (
                        <p className="mt-1 text-right text-sm text-red-500">
                          {fieldErrors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}

                    <div>
                      <input
                        name="phone"
                        type="tel"
                        placeholder="شماره تماس"
                        value={shippingInfo.phone}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        dir="rtl"
                        className={`font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black ${
                          touchedFields.phone && fieldErrors.phone
                            ? 'border-2 border-red-500'
                            : ''
                        }`}
                      />

                      {touchedFields.phone && fieldErrors.phone && (
                        <p className="mt-1 text-right text-sm text-red-500">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>

                    {/* Address */}

                    <div>
                      <input
                        name="address"
                        type="text"
                        placeholder="آدرس کامل"
                        value={shippingInfo.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black ${
                          touchedFields.address && fieldErrors.address
                            ? 'border-2 border-red-500'
                            : ''
                        }`}
                      />

                      {touchedFields.address && fieldErrors.address && (
                        <p className="mt-1 text-right text-sm text-red-500">
                          {fieldErrors.address}
                        </p>
                      )}
                    </div>

                    {/* Postal Code */}

                    <div>
                      <input
                        name="postalCode"
                        type="text"
                        placeholder="کد پستی"
                        value={shippingInfo.postalCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black ${
                          touchedFields.postalCode && fieldErrors.postalCode
                            ? 'border-2 border-red-500'
                            : ''
                        }`}
                      />

                      {touchedFields.postalCode && fieldErrors.postalCode && (
                        <p className="mt-1 text-right text-sm text-red-500">
                          {fieldErrors.postalCode}
                        </p>
                      )}
                    </div>
                  </form>
                </>
              )}

              {/* Order Notes */}

              <div className="mt-5">
                <textarea
                  name="notes"
                  placeholder="یادداشت سفارش (اختیاری)"
                  value={shippingInfo.notes}
                  onChange={handleChange}
                  rows={3}
                  className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT: Order Summary
          ================================================== */}

          <div className="space-y-6">
            {/* =================================================
                Invoice Summary
            ================================================== */}

            <div className="box-border flex w-full flex-col gap-8 rounded-[25px] border-2 border-[#F2F2F2] px-5 py-7 sm:px-[30px]">
              <h2 className="font-aria text-right text-xl font-bold text-[#09090B]">
                خلاصه فاکتور
              </h2>

              <div className="flex w-full flex-col gap-[14px]">
                {/* Products Price */}

                <div className="flex items-center justify-between gap-3">
                  <span className="font-ray text-sm font-bold text-[#555555] sm:text-base">
                    قیمت کالاها ({formatPrice(cartSummary.itemsCount)})
                  </span>

                  <span className="font-ray text-sm font-bold text-[#09090B] sm:text-base">
                    {formatPrice(cartSummary.subtotal)} تومان
                  </span>
                </div>

                {/* Customer Savings */}

                {cartSummary.savings > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-x-3">
                    <span className="font-ray text-sm font-bold text-[#555555] sm:text-base">
                      سود شما از این خرید
                    </span>

                    <span className="font-ray text-sm font-bold text-[#007926] sm:text-base">
                      ({formatPrice(cartSummary.savingsPercent)}٪){' '}
                      {formatPrice(cartSummary.savings)} تومان
                    </span>
                  </div>
                )}

                {/* Tax */}

                <div className="flex items-center justify-between gap-3">
                  <span className="font-ray text-sm font-bold text-[#555555] sm:text-base">
                    مالیات (۹٪)
                  </span>

                  <span className="font-ray text-sm font-bold text-[#09090B] sm:text-base">
                    {formatPrice(taxAmount)} تومان
                  </span>
                </div>

                {/* Shipping */}

                <div className="flex items-center justify-between gap-3">
                  <span className="font-ray text-sm font-bold text-[#555555] sm:text-base">
                    هزینه ارسال
                  </span>

                  {isFreeShipping ? (
                    <span className="font-ray rounded-[5px] bg-[#F0FDF4] px-4 py-[3px] text-xs font-medium text-[#007926]">
                      رایگان
                    </span>
                  ) : (
                    <span className="font-ray text-sm font-bold text-[#09090B] sm:text-base">
                      {formatPrice(deliveryAmount)} تومان
                    </span>
                  )}
                </div>
              </div>

              {/* Final Amount */}

              <div className="flex w-full items-start justify-between gap-3 border-t border-[#E5E5E5] pt-5">
                <span className="font-aria text-base font-bold text-[#09090B] sm:text-lg">
                  مبلغ قابل پرداخت
                </span>

                <div className="flex flex-col items-start gap-0.5">
                  <span className="font-aria text-xl font-extrabold text-[#09090B] sm:text-2xl">
                    {formatPrice(finalAmount)}
                  </span>

                  <span className="font-ray self-end text-[13px] font-bold text-[#A1A1AA]">
                    تومان
                  </span>
                </div>
              </div>

              {/* Payment Button */}

              <div className="flex w-full flex-col items-center gap-[10px]">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || cartItems.length === 0}
                  className="font-aria flex h-[54px] w-full cursor-pointer items-center justify-center gap-3 rounded-[10px] bg-black px-3 py-2.5 text-base font-bold text-white transition-all duration-200 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-500 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                      <span>
                        {paymentLoading
                          ? 'در حال اتصال به درگاه پرداخت...'
                          : orderLoading
                            ? 'در حال ثبت سفارش...'
                            : 'در حال آماده‌سازی پرداخت...'}
                      </span>
                    </>
                  ) : (
                    'ورود به درگاه و پرداخت نهایی'
                  )}
                </button>

                <span className="font-ray text-center text-xs font-medium text-[#555555]">
                  🔒 پرداخت امن با کلیه کارت‌های عضو شتاب
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Popup */}

        <InformPopup message={errorMessage} />
      </section>
    </LoadingBar>
  )
}

export default CheckoutPage
