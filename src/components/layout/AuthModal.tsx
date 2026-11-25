'use client'

import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { isInternalUrl } from '@/lib/helpers'

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  /**
   * مسیر مقصد بعد از ورود/ثبت‌نام موفق (فقط مسیرهای داخلی مجاز هستند).
   */
  callbackUrl?: string
  title?: string
  description?: string
}

export default function AuthModal({
  isOpen,
  onClose,
  callbackUrl = '/',
  title = 'ورود یا ثبت‌نام برای ادامه',
  description = 'برای ادامه خرید باید حساب کاربری بسازید یا وارد شوید. سبد خرید شما حفظ می‌شود.',
}: AuthModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  const safeCallback = useCallback(() => {
    return isInternalUrl(callbackUrl ?? '/') ? callbackUrl! : '/'
  }, [callbackUrl])

  const handleLogin = useCallback(() => {
    onClose()
  }, [onClose])

  const handleRegister = useCallback(() => {
    onClose()
  }, [onClose])

  // Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement | null
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      // Focus trap: move focus into the modal
      setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector('[data-close-modal]')
        if (closeBtn) {
          ;(closeBtn as HTMLElement).focus()
        }
      }, 0)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
      // Restore focus
      if (previousFocus.current) {
        previousFocus.current.focus()
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-clip sm:items-center sm:p-6">
      {/* انیمیشن ورود: در موبایل از پایین، در دسکتاپ fade و zoom */}
      <style>{`
        @keyframes auth-modal-fade { from { opacity: 0 } }
        @keyframes auth-modal-up { from { transform: translateY(100%) } }
        @keyframes auth-modal-zoom { from { opacity: 0; transform: scale(0.95) } }
        .auth-modal-backdrop { animation: auth-modal-fade 0.3s ease-out }
        .auth-modal-panel { animation: auth-modal-up 0.35s cubic-bezier(0.32, 0.72, 0, 1) }
        @media (min-width: 640px) {
          .auth-modal-panel { animation-name: auth-modal-zoom }
        }
        @media (prefers-reduced-motion: reduce) {
          .auth-modal-backdrop, .auth-modal-panel { animation: none }
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="auth-modal-backdrop absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={modalRef}
        dir="rtl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        aria-describedby="auth-modal-description"
        className="auth-modal-panel relative max-h-[92dvh] w-full overflow-y-auto overscroll-contain rounded-t-3xl bg-white px-5 pt-8 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-8"
      >
        <button
          data-close-modal
          type="button"
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-3 left-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white shadow-lg ring-8 shadow-black/20 ring-gray-100">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>

          <h2
            id="auth-modal-title"
            className="font-aria text-lg leading-8 font-bold text-balance text-black sm:text-xl"
          >
            {title}
          </h2>
          <p
            id="auth-modal-description"
            className="font-ray mt-2 max-w-xs text-sm leading-7 text-pretty text-gray-600"
          >
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/auth?callbackUrl=${encodeURIComponent(safeCallback())}`}
            onClick={handleLogin}
            className="font-aria flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-black text-sm font-bold text-white transition hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.98] sm:flex-1"
          >
            ورود
          </Link>
          <Link
            href={`/auth?callbackUrl=${encodeURIComponent(safeCallback())}`}
            onClick={handleRegister}
            className="font-aria flex h-12 w-full shrink-0 items-center justify-center rounded-xl border border-gray-300 bg-white text-sm font-bold text-black transition hover:border-black hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.98] sm:flex-1"
          >
            ثبت‌نام
          </Link>
        </div>

        {/* Divider */}
        <div
          className="my-4 flex items-center gap-3 text-xs text-gray-500"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-gray-200" />
          <span className="font-ray">یا</span>
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Guest */}
        <button
          type="button"
          onClick={onClose}
          className="font-aria flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-gray-100 text-sm font-medium text-gray-700 transition hover:bg-gray-200 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black active:scale-[0.98]"
        >
          ادامه به عنوان مهمان
        </button>
      </div>
    </div>
  )
}
