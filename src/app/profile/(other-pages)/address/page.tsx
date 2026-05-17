'use client'

import { useUserAddress } from '@/features/shop/hooks/profile/useUserAddress'
import { useCreateUserAddress } from '@/features/shop/hooks/profile/createUserAddress'
import {
  getCitiesByProvince,
  getProvinceByCity,
  getValidationErrorsObject,
  provinces,
  toPersianDigit,
  validateAddress,
  validateCity,
  validateFirstName,
  validateIdentifierField,
  validateLastName,
  validatePostalCode,
  validateProvince,
  validateShippingInfo,
} from '@/lib/helpers'
import { ChangeEvent, useEffect, useState } from 'react'
import { ShippingInfo } from '@/features/shop/shop.types'
import { City } from '@/components/types/types'
import { useUpdateUserProfile } from '@/features/shop/hooks/profile/updateUserProfile'
import InformPopup from '@/components/layout/InformPopup'

const AddressContent = () => {
  const { userAddress, loading, error } = useUserAddress()
  const { createUserAddress } = useCreateUserAddress()
  const { updateUserProfile } = useUpdateUserProfile()

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    city: '',
    province: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
  })

  const [errorMessage, setErrorMessage] = useState<string | null>()
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {},
  )
  const [availableCities, setAvailableCities] = useState<City[]>([])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleView = () => {
    setIsModalOpen(true)
  }

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

  const handleSubmit = async (shouldCreateNewAddress: boolean = true) => {
    // Mark all fields as touched
    const allTouched = Object.keys(shippingInfo).reduce(
      (acc, key) => {
        acc[key] = true
        return acc
      },
      {} as Record<string, boolean>,
    )
    setTouchedFields(allTouched)

    // Validate all shipping info
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
      // If its the first address user is adding and user has no addresses, update user profile with the data provided
      if (!userAddress?.addresses) {
        await updateUserProfile({
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
        })
      }

      await createUserAddress(shippingInfo)

      setErrorMessage('ادرس جدید با موفقیت ثبت شد!')
    } catch (err) {
      console.error('Address creation error:', err)
      setErrorMessage('خطا در ثبت ادرس جدید، لطفا دوباره تلاش کنید.')
    }
  }

  if (loading) {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">آدرس ها</h2>
        <div className="py-12 text-center">
          <p className="text-black">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">آدرس ها</h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          خطا در بارگذاری آدرس‌ها. لطفاً دوباره تلاش کنید.
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
      <div className="relative flex items-center">
        <h2 className="font-aria mt-0 mb-6 ml-auto text-xl font-bold text-black">
          آدرس ها
        </h2>
        <button
          type="submit"
          onClick={handleView}
          className="font-aria absolute top-0 left-0 h-9.5 w-33 cursor-pointer rounded-[5px] bg-[#161A1D] text-sm font-bold text-white transition-all hover:bg-[#2a3035] disabled:cursor-not-allowed disabled:opacity-50"
        >
          افزودن ادرس جدید
        </button>
      </div>

      {/* Check if userAddress and addresses exist before accessing length */}
      {!userAddress?.addresses || userAddress.addresses.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-black">هیچ آدرسی ثبت نشده است</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userAddress.addresses.map((address) => (
            <div
              key={address.id}
              className="rounded-lg border border-[#D9D9D9] p-5"
            >
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
          ))}
        </div>
      )}

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-100000 flex items-center justify-center bg-black/50">
          {/* Modal content container */}
          <div className="mx-4 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-lg bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-400 p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                افزودن ادرس جدید
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer text-gray-800 hover:text-gray-700 focus:outline-none"
              >
                ✕
              </button>
            </div>

            {/* Form Body - Allows vertical growth */}
            <form
              className="grid grow grid-cols-1 gap-4 overflow-y-auto p-8 md:grid-cols-2"
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
            </form>
            <div className="flex w-full items-center justify-center py-4">
              <button
                type="submit"
                onClick={() => handleSubmit()}
                className="font-aria w-68 cursor-pointer rounded-[5px] bg-[#161A1D] text-sm font-bold text-white transition-all hover:bg-[#2a3035] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ height: '50px' }} // Keeping height with inline style for precision
              >
                افزودن ادرس جدید
              </button>
            </div>
          </div>
        </div>
      )}
      <InformPopup message={errorMessage} />
    </div>
  )
}

export default AddressContent
