'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Switch } from '@/components/ui/Switch'
import InformPopup from '@/components/layout/InformPopup'

type NotificationPreferences = {
  orderUpdates: boolean
  promotions: boolean
}

export default function NotificationPreferences() {
  const router = useRouter()
  const [prefs, setPrefs] = useState<NotificationPreferences>({
    orderUpdates: true,
    promotions: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const fetchPrefs = async () => {
    try {
      const res = await fetch('/api/push/preferences')
      if (res.ok) {
        const data = await res.json()
        setPrefs(data)
      } else if (res.status === 401) {
        router.push('/auth?callbackUrl=/profile/notifications')
      }
    } catch {
      setError('خطا در بارگذاری تنظیمات')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = async (key: keyof NotificationPreferences, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: value }))
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/push/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      })

      if (!res.ok) {
        throw new Error('خطا در ذخیره تنظیمات')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch {
      setError('خطا در ذخیره تنظیمات. لطفا دوباره تلاش کنید.')
      fetchPrefs() // Revert to server state
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-[#D9D9D9] p-5 sm:p-8">
      <h2 className="font-aria text-color-title-on-light text-xl font-bold sm:text-2xl mb-6">
        تنظیمات اعلان‌ها
      </h2>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1B2024] border-t-transparent" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4 p-4 bg-[#F5F5F5] rounded-xl">
            <div className="flex-1 text-right">
              <h3 className="font-aria text-base font-bold text-[#1B2024]">اعلان‌های وضعیت سفارش</h3>
              <p className="font-ray text-sm text-[#6A7073] mt-1">
                دریافت اعلان هنگام تغییر وضعیت سفارش (پرداخت، ارسال، تحویل، لغو و...)
              </p>
            </div>
            <Switch
              checked={prefs.orderUpdates}
              onChange={(checked) => handleChange('orderUpdates', checked)}
              disabled={saving}
              size="lg"
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-4 bg-[#F5F5F5] rounded-xl">
            <div className="flex-1 text-right">
              <h3 className="font-aria text-base font-bold text-[#1B2024]">اعلان‌های تخفیف و کмпین‌ها</h3>
              <p className="font-ray text-sm text-[#6A7073] mt-1">
                دریافت اعلان برای تخفیف‌ها، کدهای تخفیف و کمپین‌های ویژه (اختیاری)
              </p>
            </div>
            <Switch
              checked={prefs.promotions}
              onChange={(checked) => handleChange('promotions', checked)}
              disabled={saving}
              size="lg"
            />
          </div>

          {success && (
            <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-sm font-ray text-[#166534] text-center">
              تنظیمات با موفقیت ذخیره شد
            </div>
          )}

          <InformPopup message={error} />
        </div>
      )}
    </div>
  )
}