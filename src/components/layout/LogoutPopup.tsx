'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'

interface LogoutPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  userName?: string
}

export default function LogoutPopup({
  isOpen,
  onClose,
  onConfirm,
}: LogoutPopupProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose()
    },
    [onClose],
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="animate-in fade-in zoom-in w-full max-w-md rounded-2xl bg-white px-9 py-7.5 shadow-2xl duration-300">
        <div className="space-y-5">
          <div className="flex items-center">
            <h1 className="font-aria text-lg font-semibold text-black">
              از حساب کاربری خارج میشوید ؟
            </h1>
            <Image src="/images/close.svg" width={22} height={22} alt="close" />
          </div>
          <hr />
          <p className="font-ray text-sm font-medium text-black">
            با خروج از حساب کاربری، به سبد خرید فعلی‌تان دسترسی نخواهید داشت.
            هروقت بخواهید می‌توانید مجددا وارد شوید و خریدتان را ادامه دهید.
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onConfirm}
            className="font-aria h-9.5 w-33 cursor-pointer rounded-[5px] bg-[#161A1D] text-sm font-bold text-white"
          >
            خروج از حساب
          </button>
          <button
            onClick={onClose}
            className="font-aria h-9.5 w-33 cursor-pointer text-sm font-bold text-black"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  )
}
