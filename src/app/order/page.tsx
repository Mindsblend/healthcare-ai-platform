'use client'

import Image from 'next/image'
import { useCart } from '@/features/shop/hooks/cart/useCart'
import { useState, ChangeEvent, useEffect } from 'react'
import { useCreateOrder } from '@/features/shop/hooks/orders/createOrders'
import { useUserAddress } from '@/features/shop/hooks/profile/useUserAddress'
import { ShippingInfo } from '@/features/shop/shop.types'
import { City } from '@/components/types/types'
import { usePayment } from '@/features/shop/hooks/payment/usePayment'
import {
  getFreeShippingStatus,
  provinces,
  getCitiesByProvince,
  getProvinceByCity,
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
import { useCreateUserAddress } from '@/features/shop/hooks/profile/createUserAddress'
import LoadingBar from '@/components/layout/LoadingBar'
import { useUpdateUserProfile } from '@/features/shop/hooks/profile/updateUserProfile'
import InformPopup from '@/components/layout/InformPopup'
import { Address } from '@/features/shop/shop.types'

const CheckoutPage = () => {
  const { cartItems, loading: cartLoading, error } = useCart()
  const [activeBtn, setActiveBtn] = useState<'mellat' | 'zarinpal'>('zarinpal')
  const { createOrder, loading: orderLoading } = useCreateOrder()
  const { createUserAddress } = useCreateUserAddress()
  const { userAddress } = useUserAddress()
  const { updateUserProfile } = useUpdateUserProfile()
  const { initiatePayment, loading: paymentLoading } = usePayment()

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null,
  )
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    city: '',
    province: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    notes: '',
  })

  const [errorMessage, setErrorMessage] = useState<string | null>()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  )
  const [availableCities, setAvailableCities] = useState<City[]>([])

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  )
  const TAX_RATE = 0.09
  const taxAmount = Math.round(subtotal * TAX_RATE)
  const totalAmount = subtotal + taxAmount
  const FREE_SHIPPING_THRESHOLD = 2_000_000
  const isFreeShipping = getFreeShippingStatus(
    subtotal,
    FREE_SHIPPING_THRESHOLD,
  )
  const deliveryAmount = isFreeShipping ? 0 : 300_000

  // Auto-select default address when userAddress loads
  useEffect(() => {
    if (
      userAddress?.addresses &&
      userAddress.addresses.length > 0 &&
      !isAddingNewAddress
    ) {
      // Find default address
      const defaultAddress = userAddress.addresses.find(
        (addr: Address) => addr.isDefault,
      )
      // If no default address exists, use the first one
      const addressToSelect = defaultAddress || userAddress.addresses[0]

      if (addressToSelect) {
        setSelectedAddressId(addressToSelect.id)
        setShippingInfo({
          firstName: addressToSelect.firstName,
          lastName: addressToSelect.lastName,
          city: addressToSelect.city,
          province: addressToSelect.province,
          email: addressToSelect.email || '',
          phone: addressToSelect.phone,
          address: addressToSelect.address,
          postalCode: addressToSelect.postalCode,
          notes: '',
        })
      }
    }
  }, [userAddress, isAddingNewAddress])

  // Update cities when province changes
  useEffect(() => {
    if (shippingInfo.province) {
      const cities = getCitiesByProvince(shippingInfo.province)
      setAvailableCities(cities)

      // Clear city if the current city doesn't belong to the new province
      if (shippingInfo.city) {
        const provinceForCity = getProvinceByCity(shippingInfo.city)
        if (provinceForCity?.name !== shippingInfo.province) {
          setShippingInfo((prev) => ({ ...prev, city: '' }))
          // Clear city error if exists
          if (fieldErrors.city) {
            setFieldErrors((prev) => ({ ...prev, city: '' }))
          }
        }
      }
    } else {
      setAvailableCities([])
    }
  }, [shippingInfo.province])

  // Auto-set province when city is selected
  useEffect(() => {
    if (shippingInfo.city) {
      const province = getProvinceByCity(shippingInfo.city)
      if (province && province.name !== shippingInfo.province) {
        setShippingInfo((prev) => ({ ...prev, province: province.name }))
      }
    }
  }, [shippingInfo.city])

  // Real-time field validation on blur
  const handleBlur = async (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target

    setTouchedFields((prev) => ({ ...prev, [name]: true }))

    let error: string | null = null

    switch (name) {
      case 'firstName':
        error = validateFirstName(value)?.message || null
        break
      case 'lastName':
        error = validateLastName(value)?.message || null
        break
      case 'email':
        const emailValidation = await validateIdentifierField(value)
        error = emailValidation.isValid ? null : emailValidation.error || null
        break
      case 'phone':
        const phoneValidation = await validateIdentifierField(value)
        error = phoneValidation.isValid ? null : phoneValidation.error || null
        break
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
    }

    setFieldErrors((prev) => ({ ...prev, [name]: error || '' }))
  }

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setShippingInfo((prev) => ({ ...prev, province: value, city: '' }))

    // Clear related errors
    setFieldErrors((prev) => ({ ...prev, province: '', city: '' }))

    // Mark as touched
    setTouchedFields((prev) => ({ ...prev, province: true, city: true }))
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target
    setShippingInfo((prev) => ({ ...prev, city: value }))

    // Clear city error
    setFieldErrors((prev) => ({ ...prev, city: '' }))

    // Mark as touched
    setTouchedFields((prev) => ({ ...prev, city: true }))
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle form submission with payment integration
  const handleSubmit = async (shouldCreateNewAddress: boolean = true) => {
    // 1. Mark all fields as touched
    const allTouched = Object.keys(shippingInfo).reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>,
    )
    setTouchedFields(allTouched)

    // 2. Validate all shipping information
    const validation = await validateShippingInfo(
      shippingInfo,
      provinces,
      getCitiesByProvince,
    )

    if (!validation.isValid) {
      const errors = getValidationErrorsObject(validation.errors)
      setFieldErrors(errors)

      // Scroll to first error
      const firstErrorField = validation.errors[0]?.field
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`)
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }

      return
    }

    try {
      // 3. Update user profile if needed
      if (!userAddress?.addresses && isAddingNewAddress) {
        await updateUserProfile({
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
        })
      }

      // 4. Create new address if needed
      if (shouldCreateNewAddress && !selectedAddressId) {
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

      // 5. Create order
      console.log('📝 1. Creating order...')
      const orderResult = await createOrder({
        shippingInfo,
        paymentMethod: activeBtn,
      })

      console.log('✅ 2. Order created:', orderResult)

      if (!orderResult?.id) {
        throw new Error('Failed to create order')
      }

      // 6. Recalculate total amount (matching OrderService)
      const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      )
      const TAX_RATE = 0.09
      const taxAmount = Math.round(subtotal * TAX_RATE)
      const FREE_SHIPPING_THRESHOLD = 2_000_000
      const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD
      const deliveryAmount = isFreeShipping ? 0 : 300_000
      const totalAmountInTomans = subtotal + taxAmount + deliveryAmount

      console.log('💰 3. Order total from DB:', orderResult.totalPrice)
      console.log('💰 4. Calculated total (Tomans):', totalAmountInTomans)

      // Check if amounts match
      if (orderResult.totalPrice !== totalAmountInTomans) {
        console.error('❌ Amount mismatch!', {
          orderTotal: orderResult.totalPrice,
          calculatedTotal: totalAmountInTomans,
          difference: totalAmountInTomans - orderResult.totalPrice,
        })
        // Continue anyway but log it
      }

      // 7. Initiate payment with amount in Toman
      console.log('💳 6. Initiating payment...')
      const paymentResult = await initiatePayment({
        amount: totalAmountInTomans, // Send in Toman
        description: `سفارش شماره ${orderResult.id}`,
        orderId: orderResult.id,
        email: shippingInfo.email,
        mobile: shippingInfo.phone,
      })

      console.log('📊 7. Payment result:', paymentResult)

      // 8. If we reach here, redirect didn't happen and an error occurred
      if (!paymentResult.success) {
        setErrorMessage(paymentResult.error || 'خطا در اتصال به درگاه پرداخت')
      }
    } catch (err) {
      console.error('❌ Order creation error:', err)
      setErrorMessage('خطا در ثبت سفارش، لطفا دوباره تلاش کنید.')
    }
  }

  // Check if user has addresses
  if (
    userAddress?.addresses &&
    userAddress.addresses.length > 0 &&
    !isAddingNewAddress
  ) {
    return (
      <LoadingBar loading={cartLoading || paymentLoading} error={error}>
        <div className="container my-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
            {/* RIGHT: Address Selection */}
            <div className="col-span-1 xl:col-span-2">
              <div className="rounded-2xl border-2 border-[#d9d9d9] bg-white p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-aria text-color-title-on-light text-right text-[24px] font-bold">
                    انتخاب آدرس ارسال
                  </h2>
                  <button
                    onClick={() => {
                      setIsAddingNewAddress(true)
                      // Reset form to empty
                      setShippingInfo({
                        firstName: '',
                        lastName: '',
                        city: '',
                        province: '',
                        email: '',
                        phone: '',
                        address: '',
                        postalCode: '',
                        notes: '',
                      })
                      setSelectedAddressId(null)
                    }}
                    className="font-aria w-35 cursor-pointer rounded-[5px] bg-[#161A1D] text-sm font-bold text-white transition-all hover:bg-[#2a3035] disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ height: '50px' }}
                  >
                    ثبت آدرس جدید
                  </button>
                </div>

                <div className="space-y-4">
                  {userAddress.addresses.map(
                    (address: Address, index: number) => (
                      <div
                        key={address.id || index}
                        className={`cursor-pointer rounded-lg border transition hover:bg-gray-50 ${
                          selectedAddressId === address.id
                            ? 'border-2 border-black'
                            : 'border border-[#D9D9D9]'
                        }`}
                        onClick={() => {
                          setSelectedAddressId(address.id)
                          // Set selected address to shippingInfo
                          setShippingInfo({
                            firstName: address.firstName,
                            lastName: address.lastName,
                            city: address.city,
                            province: address.province,
                            email: address.email || '',
                            phone: address.phone,
                            address: address.address,
                            postalCode: address.postalCode,
                            notes: shippingInfo.notes,
                          })
                        }}
                      >
                        <div className="p-5">
                          <div className="font-ray flex items-start justify-between text-lg font-medium">
                            <div className="space-y-2">
                              {address.isDefault && (
                                <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-600">
                                  آدرس پیش‌فرض
                                </span>
                              )}
                              <p className="text-black">{address.address}</p>
                              <div className="flex flex-col space-y-2 text-black">
                                <span>شهر: {address.city}</span>
                                <span>استان: {address.province}</span>
                              </div>
                              <span className="flex text-black">
                                کد پستی: {toPersianDigit(address.postalCode)}
                              </span>
                              <div className="flex gap-1 text-black">
                                <span>
                                  گیرنده: {address.firstName} {address.lastName}
                                </span>
                                |<span>{toPersianDigit(address.phone)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
                {/* Notes */}
                <div className="mt-5 md:col-span-2">
                  <textarea
                    name="notes"
                    placeholder="یادداشت سفارش (اختیاری)"
                    value={shippingInfo.notes}
                    onChange={handleChange}
                    className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-between rounded-2xl border-2 border-[#d9d9d9] bg-white px-6 py-3.5">
                  {/* Payment Method Buttons */}
                  <div>
                    <h1 className="font-aria text-color-title-on-light text-base font-extrabold">
                      انتخاب درگاه پرداخت
                    </h1>
                    <p className="font-aria text-color-body-on-dark my-1.5 max-w-xs text-sm font-semibold">
                      شما با انتخاب درگاه پرداخت خود میتوانید خریدی اسوده و
                      مطمعن داشته باشید.
                    </p>
                  </div>
                  <div className="flex items-center gap-3.5">
                    <div
                      onClick={() => setActiveBtn('zarinpal')}
                      className={`flex h-19.5 cursor-pointer items-center justify-center rounded-2xl p-3 ${
                        activeBtn === 'zarinpal'
                          ? 'border-2 border-[#d9d9d9] bg-white'
                          : ''
                      }`}
                    >
                      <Image
                        src="/images/zarinpal.webp"
                        alt="zarinpal"
                        width={38}
                        height={50}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== RIGHT: Order Summary ===== */}
            <div className="space-y-6">
              {/* Cart Details */}
              <div className="flex h-92.5 flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-7">
                <h1 className="font-aria text-color-title-on-light mt-9 text-center text-2xl font-extrabold">
                  لیست سفارشات
                </h1>
                <div className="mt-8 mb-8 flex-1 space-y-5 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between rounded-xl border-b pb-5 last:border-b-0 max-sm:flex-col max-sm:space-y-3 sm:items-center"
                    >
                      <div className="shrink-0">
                        {item.product.image &&
                        item.product.image.trim() !== '' ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.title}
                            width={80}
                            height={80}
                            className="h-20 w-20 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                            <span className="text-xs text-gray-400">
                              بدون تصویر
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 sm:px-4">
                        <h3 className="font-aria text-color-title-on-light text-lg font-extrabold">
                          {item.product.title}
                        </h3>
                        <p className="font-ray text-color-body-on-light mt-1 line-clamp-2 text-xs font-medium">
                          {item.product.solution}
                        </p>
                      </div>
                      <div className="font-aria text-color-title-on-light shrink-0 text-base font-extrabold">
                        {item.price.toLocaleString('fa-IR')} تومان
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="flex h-113 flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-9 py-9">
                <h1 className="font-aria text-color-title-on-light text-center text-2xl font-extrabold">
                  خلاصه سفارشات
                </h1>
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <h1 className="font-aria text-color-title-on-light font-extrabold">
                      جمع خرید
                    </h1>
                    <h1 className="font-aria text-color-title-on-light font-extrabold">
                      {subtotal.toLocaleString('fa-IR')} تومان
                    </h1>
                  </div>
                  <div className="flex items-center justify-between">
                    <h1 className="font-aria text-color-title-on-light font-extrabold">
                      مالیات
                    </h1>
                    <h1 className="font-aria text-color-title-on-light font-extrabold">
                      {taxAmount.toLocaleString('fa-IR')} تومان
                    </h1>
                  </div>
                  <div className="flex items-center justify-between">
                    <h1 className="font-aria text-color-title-on-light font-extrabold">
                      هزینه ارسال
                    </h1>
                    <h1 className="font-aria text-color-title-on-light font-extrabold">
                      {isFreeShipping
                        ? 'ارسال رایگان 🎉'
                        : deliveryAmount.toLocaleString('fa-IR') + ' تومان'}
                    </h1>
                  </div>
                  <hr className="border" />
                  <div className="flex items-center justify-between">
                    <h1 className="font-aria text-color-title-on-light font-extrabold">
                      جمع کل
                    </h1>
                    <h1 className="font-aria text-color-title-on-light font-extrabold">
                      {(totalAmount + deliveryAmount).toLocaleString('fa-IR')}{' '}
                      تومان
                    </h1>
                  </div>
                </div>
                <button
                  onClick={() => handleSubmit(true)}
                  disabled={orderLoading || paymentLoading}
                  className="text-color-title-on-dark font-ray h-13.5 w-full cursor-pointer rounded-4xl bg-black font-medium transition hover:bg-gray-800 disabled:opacity-50"
                >
                  {paymentLoading
                    ? 'در حال اتصال به درگاه پرداخت...'
                    : orderLoading
                      ? 'در حال ثبت سفارش...'
                      : 'ثبت سفارش و پرداخت'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </LoadingBar>
    )
  }

  return (
    <section className="container mt-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3">
        {/* ===== RIGHT: Checkout Form ===== */}
        <div className="col-span-1 xl:col-span-2">
          <div className="rounded-2xl border-2 border-[#d9d9d9] bg-white p-8">
            <h2 className="font-aria text-color-title-on-light mb-6 text-right text-[24px] font-bold">
              اطلاعات خرید
            </h2>

            <form
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
              onSubmit={(e) => e.preventDefault()}
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
                  className={`font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black ${
                    touchedFields.city && fieldErrors.city
                      ? 'border-2 border-red-500'
                      : ''
                  }`}
                  disabled={!shippingInfo.province}
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

              {/* Notes */}
              <div className="md:col-span-2">
                <textarea
                  name="notes"
                  placeholder="یادداشت سفارش (اختیاری)"
                  value={shippingInfo.notes}
                  onChange={handleChange}
                  className="font-aria text-color-body-on-light w-full rounded-lg bg-[#F2F2F2] p-3 font-bold outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-between rounded-2xl border-2 border-[#d9d9d9] bg-white px-6 py-3.5">
              {/* Payment Method Buttons */}
              <div>
                <h1 className="font-aria text-color-title-on-light text-base font-extrabold">
                  انتخاب درگاه پرداخت
                </h1>
                <p className="font-aria text-color-body-on-dark my-1.5 max-w-xs text-sm font-semibold">
                  شما با انتخاب درگاه پرداخت خود میتوانید خریدی اسوده و مطمعن
                  داشته باشید.
                </p>
              </div>
              <div className="flex items-center gap-3.5">
                <div
                  onClick={() => setActiveBtn('zarinpal')}
                  className={`flex h-19.5 cursor-pointer items-center justify-center rounded-2xl p-3 ${
                    activeBtn === 'zarinpal'
                      ? 'border-2 border-[#d9d9d9] bg-white'
                      : ''
                  }`}
                >
                  <Image
                    src="/images/zarinpal.webp"
                    alt="zarinpal"
                    width={38}
                    height={50}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== LEFT: Order Summary ===== */}
        <div className="space-y-6">
          {/* Cart Details */}
          <div className="flex h-92.5 flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-7">
            <h1 className="font-aria text-color-title-on-light mt-9 text-center text-2xl font-extrabold">
              لیست سفارشات
            </h1>
            <div className="mt-8 mb-8 flex-1 space-y-5 overflow-y-auto">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between rounded-xl border-b pb-5 last:border-b-0 max-sm:flex-col max-sm:space-y-3 sm:items-center"
                >
                  <div className="shrink-0">
                    {item.product.image && item.product.image.trim() !== '' ? (
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        width={80}
                        height={80}
                        className="h-20 w-20 rounded-2xl object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gray-100">
                        <span className="text-xs text-gray-400">
                          بدون تصویر
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 sm:px-4">
                    <h3 className="font-aria text-color-title-on-light text-lg font-extrabold">
                      {item.product.title}
                    </h3>
                    <p className="font-ray text-color-body-on-light mt-1 line-clamp-2 text-xs font-medium">
                      {item.product.solution}
                    </p>
                  </div>
                  <div className="font-aria text-color-title-on-light shrink-0 text-base font-extrabold">
                    {item.price.toLocaleString('fa-IR')} تومان
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex h-113 flex-col justify-between rounded-3xl border-2 border-[#d9d9d9] px-9 py-9">
            <h1 className="font-aria text-color-title-on-light text-center text-2xl font-extrabold">
              خلاصه سفارشات
            </h1>
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  جمع خرید
                </h1>
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  {subtotal.toLocaleString('fa-IR')} تومان
                </h1>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  مالیات
                </h1>
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  {taxAmount.toLocaleString('fa-IR')} تومان
                </h1>
              </div>
              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  هزینه ارسال
                </h1>
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  {isFreeShipping
                    ? 'ارسال رایگان 🎉'
                    : deliveryAmount.toLocaleString('fa-IR') + ' تومان'}
                </h1>
              </div>
              <hr className="border" />
              <div className="flex items-center justify-between">
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  جمع کل
                </h1>
                <h1 className="font-aria text-color-title-on-light font-extrabold">
                  {(totalAmount + deliveryAmount).toLocaleString('fa-IR')} تومان
                </h1>
              </div>
            </div>
            <button
              onClick={() => handleSubmit(true)}
              disabled={orderLoading || paymentLoading}
              className="text-color-title-on-dark font-ray h-13.5 w-full cursor-pointer rounded-4xl bg-black font-medium transition hover:bg-gray-800 disabled:opacity-50"
            >
              {paymentLoading
                ? 'در حال اتصال به درگاه پرداخت...'
                : orderLoading
                  ? 'در حال ثبت سفارش...'
                  : 'ثبت سفارش و پرداخت'}
            </button>
          </div>
        </div>
      </div>
      <InformPopup message={errorMessage} />
    </section>
  )
}

export default CheckoutPage
