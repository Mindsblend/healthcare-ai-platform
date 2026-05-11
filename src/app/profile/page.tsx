'use client'

import { useUserInfo } from '@/features/shop/hooks/profile/useUserInfo'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUpdateUserProfile } from '@/features/shop/hooks/profile/updateUserProfile'
import { toPersianDigit } from '@/lib/helpers'
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
  type ValidationError,
} from '@/lib/helpers'

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export default function Profile() {
  const { userInfo, loading, error } = useUserInfo()
  const { updateUserProfile, loading: updateLoading } = useUpdateUserProfile()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>(
    'idle',
  )

  useEffect(() => {
    if (userInfo) {
      setFormData({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
      })
    }
  }, [userInfo])

  // Validate a single field
  const validateField = (field: string, value: string): string | null => {
    let validationError: ValidationError | null = null

    switch (field) {
      case 'firstName':
        validationError = validateFirstName(value)
        break
      case 'lastName':
        validationError = validateLastName(value)
        break
      case 'email':
        // Only validate email if it's provided (not required)
        if (value && value.trim().length > 0) {
          validationError = validateEmail(value)
        }
        break
      case 'phone':
        // Only validate phone if it's provided (not required)
        if (value && value.trim().length > 0) {
          validationError = validatePhone(value)
        }
        break
    }

    return validationError?.message || null
  }

  // Validate entire form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validate firstName (required)
    const firstNameError = validateFirstName(formData.firstName)
    if (firstNameError) newErrors.firstName = firstNameError.message

    // Validate lastName (required)
    const lastNameError = validateLastName(formData.lastName)
    if (lastNameError) newErrors.lastName = lastNameError.message

    // Validate email (optional but must be valid if provided)
    if (formData.email && formData.email.trim().length > 0) {
      const emailError = validateEmail(formData.email)
      if (emailError) newErrors.email = emailError.message
    }

    // Validate phone (optional but must be valid if provided)
    if (formData.phone && formData.phone.trim().length > 0) {
      const phoneError = validatePhone(formData.phone)
      if (phoneError) newErrors.phone = phoneError.message
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field while typing
    setErrors((prev) => ({ ...prev, [name]: undefined }))

    // Optional: Real-time validation
    const fieldError = validateField(name, value)
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [name]: fieldError }))
    }

    setSaveStatus('idle')
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const fieldError = validateField(name, value)

    if (fieldError) {
      setErrors((prev) => ({ ...prev, [name]: fieldError }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!userInfo?.id) {
      console.error('No user ID available')
      setSaveStatus('error')
      return
    }
    setSaveStatus('idle')

    try {
      // Use the updateUserProfile hook instead of direct fetch
      await updateUserProfile(userInfo?.id, formData)

      setSaveStatus('success')

      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setSaveStatus('error')
    }
  }

  const handleCancel = () => {
    if (userInfo) {
      setFormData({
        firstName: userInfo.firstName || '',
        lastName: userInfo.lastName || '',
        email: userInfo.email || '',
        phone: userInfo.phone || '',
      })
    }
    setErrors({})
    setSaveStatus('idle')
  }

  if (loading) {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">
          پروفایل کاربری
        </h2>
        <div className="py-12 text-center">
          <p className="text-black">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
        <h2 className="font-aria mb-6 text-xl font-bold text-black">
          پروفایل کاربری
        </h2>
        <div className="rounded-lg bg-red-50 p-4 text-red-600">
          خطا در بارگذاری اطلاعات. لطفاً دوباره تلاش کنید.
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 rounded-lg border-[1.5px] border-[#D9D9D9] bg-white px-10 py-8">
      <h2 className="font-aria mb-6 text-xl font-bold text-black">
        پروفایل کاربری
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-5">
            {/* First Name */}
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                نام
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="نام خود را وارد کنید"
                className={`font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black placeholder:text-sm placeholder:text-gray-400 ${
                  errors.firstName ? 'border-2 border-red-500' : ''
                }`}
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                نام خانوادگی
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="نام خانوادگی خود را وارد کنید"
                className={`font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black placeholder:text-sm placeholder:text-gray-400 ${
                  errors.lastName ? 'border-2 border-red-500' : ''
                }`}
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                ایمیل
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="example@email.com"
                className={`font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black placeholder:text-sm placeholder:text-gray-400 ${
                  errors.email ? 'border-2 border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="font-aria text-sm font-semibold text-[#A2A2A2]">
                شماره موبایل{' '}
              </label>
              <input
                type="tel"
                name="phone"
                value={toPersianDigit(formData.phone)}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0912 123 4567"
                className={`font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-right text-sm font-semibold text-black placeholder:text-sm placeholder:text-gray-400 ${
                  errors.phone ? 'border-2 border-red-500' : ''
                }`}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Save Status Message */}
          {saveStatus === 'success' && (
            <div className="animate-fade-in mt-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-600">
              ✓ اطلاعات با موفقیت به‌روزرسانی شد
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
              ✗ خطا در به‌روزرسانی اطلاعات. لطفاً دوباره تلاش کنید.
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-7.5 flex gap-x-3 self-end">
            <button
              type="button"
              onClick={handleCancel}
              className="font-aria h-9.5 w-33 cursor-pointer rounded-[5px] text-sm font-bold text-black transition-colors hover:bg-gray-100"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={updateLoading}
              className="font-aria h-9.5 w-33 cursor-pointer rounded-[5px] bg-[#161A1D] text-sm font-bold text-white transition-all hover:bg-[#2a3035] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updateLoading ? 'در حال ذخیره...' : 'اعمال تغییرات'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
