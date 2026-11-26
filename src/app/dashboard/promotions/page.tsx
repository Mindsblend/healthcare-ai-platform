'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import InformPopup from '@/components/layout/InformPopup'
import { Switch } from '@/components/ui/Switch'

type Campaign = {
  id: string
  title: string
  body: string
  url: string
  status: 'DRAFT' | 'SENDING' | 'COMPLETED' | 'FAILED'
  totalRecipients: number
  sentCount: number
  failedCount: number
  createdAt: string
  sentAt: string | null
}

export default function PromotionsPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sendingTest, setSendingTest] = useState(false)
  const [lastWasTest, setLastWasTest] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    url: '/',
  })
  const [previewMode, setPreviewMode] = useState(false)

  const fetchCampaigns = async () => {
    try {
      const res = await fetch('/api/admin/promotions')
      if (res.ok) {
        const data = await res.json()
        setCampaigns(data)
      } else if (res.status === 401 || res.status === 403) {
        router.push('/auth?callbackUrl=/dashboard/promotions')
      }
    } catch {
      setError('خطا در بارگذاری کمپین‌ها')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, isTest = false) => {
    e.preventDefault()
    setSaving(true)
    setLastWasTest(isTest)
    setError(null)

    try {
      const endpoint = isTest ? '/api/admin/promotions/test' : '/api/admin/promotions'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || (isTest ? 'خطا در ارسال تست' : 'خطا در ایجاد کمپین'))
      }

      if (!isTest) {
        setSuccess(true)
        setShowModal(false)
        setFormData({ title: '', body: '', url: '/' })
        setTimeout(() => setSuccess(false), 3000)
        fetchCampaigns()
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطای ناشناخته')
    } finally {
      setSaving(false)
      setSendingTest(false)
    }
  }

  const handlePreview = () => {
    setPreviewMode(true)
  }

  return (
    <div className="container my-10">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="font-aria text-2xl font-bold text-[#1B2024]">مدیریت کمپین‌های اعلان</h1>
        <Button onClick={() => setShowModal(true)} disabled={saving}>
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          کمپین جدید
        </Button>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-sm font-ray text-[#166534] flex items-center justify-between">
          <span>{lastWasTest ? 'اعلان تست با موفقیت ارسال شد' : 'کمپین با موفقیت ایجاد و ارسال شد'}</span>
          <button onClick={() => setSuccess(false)} className="text-[#166534] hover:underline">بستن</button>
        </div>
      )}

      <InformPopup message={error} />

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1B2024] border-t-transparent" />
        </div>
      ) : campaigns.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#D9D9D9] p-10 text-center">
          <svg className="mx-auto h-12 w-12 text-[#D9D9D9]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <h3 className="font-aria text-lg font-bold text-[#1B2024] mt-4">هیچ کمپینی وجود ندارد</h3>
          <p className="font-ray text-sm text-[#6A7073] mt-2">اولین کمپین اعلان را بسازید</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#D9D9D9] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-[#F5F5F5]">
                <tr>
                  <th className="px-4 py-3 font-aria text-sm font-bold text-[#6A7073]">عنوان</th>
                  <th className="px-4 py-3 font-aria text-sm font-bold text-[#6A7073]">وضعیت</th>
                  <th className="px-4 py-3 font-aria text-sm font-bold text-[#6A7073]">گیرندگان</th>
                  <th className="px-4 py-3 font-aria text-sm font-bold text-[#6A7073]">ارسال شده</th>
                  <th className="px-4 py-3 font-aria text-sm font-bold text-[#6A7073]">ناموفق</th>
                  <th className="px-4 py-3 font-aria text-sm font-bold text-[#6A7073]">تاریخ ایجاد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D9D9D9]">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-[#F5F5F5]">
                    <td className="px-4 py-3 font-ray text-sm text-[#1B2024] max-w-xs truncate">{campaign.title}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        campaign.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        campaign.status === 'SENDING' ? 'bg-blue-100 text-blue-800' :
                        campaign.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status === 'COMPLETED' && 'تکمیل شده'}
                        {campaign.status === 'SENDING' && 'در حال ارسال'}
                        {campaign.status === 'FAILED' && 'ناموفق'}
                        {campaign.status === 'DRAFT' && 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-ray text-sm text-[#1B2024]">{campaign.totalRecipients.toLocaleString('fa-IR')}</td>
                    <td className="px-4 py-3 font-ray text-sm text-green-600">{campaign.sentCount.toLocaleString('fa-IR')}</td>
                    <td className="px-4 py-3 font-ray text-sm text-red-600">{campaign.failedCount.toLocaleString('fa-IR')}</td>
                    <td className="px-4 py-3 font-ray text-sm text-[#6A7073]">
                      {new Date(campaign.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-[#D9D9D9] flex items-center justify-between">
              <h2 className="font-aria text-xl font-bold text-[#1B2024]">{previewMode ? 'پیش‌نمایش' : 'کمپین جدید'}</h2>
              <button onClick={() => { setShowModal(false); setPreviewMode(false); }} className="text-[#6A7073] hover:text-[#1B2024]">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => handleSubmit(e, previewMode)} className="p-6 space-y-5">
              {previewMode && (
                <div className="bg-[#F5F5F5] rounded-xl p-4">
                  <h3 className="font-aria text-sm font-bold text-[#1B2024] mb-3">پیش‌نمایش اعلان</h3>
                  <div className="bg-white rounded-lg p-4 border border-[#D9D9D9] text-right">
                    <p className="font-aria font-bold text-[#1B2024]">{formData.title || 'عنوان اعلان'}</p>
                    <p className="font-ray text-sm text-[#6A7073] mt-2">{formData.body || 'متن اعلان'}</p>
                    <p className="font-ray text-xs text-[#B1C8FF] mt-2">{formData.url || '/'} </p>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block font-ray text-sm font-medium text-[#1B2024] mb-1">عنوان *</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="font-aria w-full rounded-lg border border-[#D9D9D9] bg-[#F5F5F5] px-4 py-3 focus:border-[#1B2024] focus:ring-1 focus:ring-[#1B2024] outline-none"
                  placeholder="مثال: تخفیف ویژه آخر هفته"
                  maxLength={80}
                  required
                  disabled={saving || previewMode}
                />
              </div>

              <div>
                <label htmlFor="body" className="block font-ray text-sm font-medium text-[#1B2024] mb-1">متن اعلان *</label>
                <textarea
                  id="body"
                  value={formData.body}
                  onChange={(e) => setFormData((prev) => ({ ...prev, body: e.target.value }))}
                  rows={3}
                  className="font-aria w-full rounded-lg border border-[#D9D9D9] bg-[#F5F5F5] px-4 py-3 focus:border-[#1B2024] focus:ring-1 focus:ring-[#1B2024] outline-none resize-none"
                  placeholder="مثال: تا پایان هفته ۳۰٪ تخفیف روی تمام محصولات دارویی..."
                  maxLength={240}
                  required
                  disabled={saving || previewMode}
                />
              </div>

              <div>
                <label htmlFor="url" className="block font-ray text-sm font-medium text-[#1B2024] mb-1">لینک داخلی *</label>
                <input
                  id="url"
                  type="text"
                  value={formData.url}
                  onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
                  className="font-aria w-full rounded-lg border border-[#D9D9D9] bg-[#F5F5F5] px-4 py-3 focus:border-[#1B2024] focus:ring-1 focus:ring-[#1B2024] outline-none"
                  placeholder="/products/special-offer"
                  maxLength={512}
                  required
                  disabled={saving || previewMode}
                />
              </div>

              <div className="flex gap-3 pt-4">
                {!previewMode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreview}
                    disabled={saving || !formData.title || !formData.body}
                    className="flex-1"
                  >
                    پیش‌نمایش
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setShowModal(false); setPreviewMode(false); }}
                  disabled={saving}
                  className="flex-1"
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !formData.title || !formData.body}
                  className="flex-1"
                >
                  {previewMode ? (
                    <>
                      <span className="mr-2">تست برای خودم</span>
                      {sendingTest && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />}
                    </>
                  ) : (
                    <>
                      {saving ? 'در حال ایجاد...' : 'ایجاد و ارسال'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}