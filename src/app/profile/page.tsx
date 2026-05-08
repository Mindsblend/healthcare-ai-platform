'use client'

import { useUserInfo } from '@/features/shop/hooks/profile/useUserInfo'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export default function Profile() {
  const { userInfo, loading, error } = useUserInfo()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Email validation (if provided)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست'
    }

    // Phone validation (if provided)
    if (formData.phone) {
      const phoneDigits = formData.phone.replace(/\D/g, '')
      if (!/^09\d{9}$/.test(phoneDigits)) {
        newErrors.phone = 'شماره موبایل معتبر نیست'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: undefined }))
    setSaveStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/shop/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setSaveStatus('success')

      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setSaveStatus('error')
    } finally {
      setIsSubmitting(false)
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
        loading
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
                placeholder="نام خانوادگی خود را وارد کنید"
                className="font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black placeholder:text-sm placeholder:text-gray-400"
              />
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
                شماره موبایل
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0912 123 4567"
                className={`font-aria mt-2.5 h-11.25 w-full rounded-xl bg-[#F2F2F2] p-3.25 text-sm font-semibold text-black placeholder:text-sm placeholder:text-gray-400 ${
                  errors.phone ? 'border-2 border-red-500' : ''
                }`}
                dir="ltr"
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
              disabled={isSubmitting}
              className="font-aria h-9.5 w-33 cursor-pointer rounded-[5px] bg-[#161A1D] text-sm font-bold text-white transition-all hover:bg-[#2a3035] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'در حال ذخیره...' : 'اعمال تغییرات'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
