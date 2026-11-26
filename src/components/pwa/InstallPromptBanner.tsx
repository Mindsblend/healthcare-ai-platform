'use client'

import { useInstallPrompt } from './InstallPrompt'
import { XIcon } from '@/components/icons/XIcon'

export default function InstallPromptBanner() {
  const { canInstall, showIOSInstructions, install, dismiss, resetDismiss } = useInstallPrompt()

  if (!canInstall && !showIOSInstructions) return null

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label={canInstall ? 'نصب برنامه' : 'راهنمای نصب در iOS'}
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md mx-auto">
        <div className="relative bg-white rounded-2xl shadow-xl border border-[#D9D9D9] overflow-hidden animate-slide-up">
          {canInstall && (
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1B2024] text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <h3 className="font-aria text-base font-bold text-[#1B2024]">دیجی سلامت را نصب کنید</h3>
                    <p className="font-ray text-sm text-[#6A7073] mt-1">برای دسترسی سریع‌تر و تجربه بهتر، برنامه را به صفحه اصلی اضافه کنید</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-[#6A7073] hover:text-[#1B2024] transition-colors p-1"
                  aria-label="بستن"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={install}
                  className="flex-1 font-aria bg-[#1B2024] text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-[#23282D] transition-colors active:scale-[0.98]"
                >
                  نصب برنامه
                </button>
                <button
                  type="button"
                  onClick={dismiss}
                  className="flex-1 font-aria border border-[#D9D9D9] text-[#1B2024] py-3 px-4 rounded-xl font-bold text-sm hover:bg-[#F5F5F5] transition-colors active:scale-[0.98]"
                >
                  بعداً
                </button>
              </div>
            </div>
          )}

          {showIOSInstructions && (
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <h3 className="font-aria text-base font-bold text-[#1B2024]">نصب در آیفون و آیپد</h3>
                    <p className="font-ray text-sm text-[#6A7073] mt-1">از منوی اشتراک‌گذاری مرورگر استفاده کنید</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={dismiss}
                  className="text-[#6A7073] hover:text-[#1B2024] transition-colors p-1"
                  aria-label="بستن"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-right">
                <div className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-xl">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1B2024] font-bold text-sm">۱</span>
                  <div>
                    <p className="font-ray text-sm font-medium text-[#1B2024]">دکمه اشتراک‌گذاری را بزنید</p>
                    <p className="font-ray text-xs text-[#6A7073]">آیکون مربع با فلش بالا</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-xl">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1B2024] font-bold text-sm">۲</span>
                  <div>
                    <p className="font-ray text-sm font-medium text-[#1B2024]">«افزودن به صفحه اصلی» را انتخاب کنید</p>
                    <p className="font-ray text-xs text-[#6A7073]">در لیست گزینه‌ها</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#F5F5F5] rounded-xl">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#1B2024] font-bold text-sm">۳</span>
                  <div>
                    <p className="font-ray text-sm font-medium text-[#1B2024]">نام را تایید و «افزودن» بزنید</p>
                    <p className="font-ray text-xs text-[#6A7073]">برنامه در صفحه اصلی ظاهر می‌شود</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetDismiss}
                  className="w-full font-aria border border-[#D9D9D9] text-[#1B2024] py-2.5 px-4 rounded-xl font-bold text-sm hover:bg-[#F5F5F5] transition-colors mt-2"
                >
                  متوجه شدم، بعداً یادآوری کن
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}