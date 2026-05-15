'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'

interface ConfirmPopupProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  popupTitle: string
  descriptionText: string
  confirmButtonText: string
  cancelButtonText: string
  closeButtonAltText?: string
}

export default function ConfirmPopup({
  isOpen,
  onClose,
  onConfirm,
  popupTitle,
  descriptionText,
  confirmButtonText,
  cancelButtonText,
  closeButtonAltText = 'Close', // Default alt text if not provided
}: ConfirmPopupProps) {
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
          <div className="flex items-center justify-between">
            <h1 className="font-aria text-lg font-semibold text-black">
              {popupTitle}
            </h1>
            {/* Use the closeButtonAltText prop here */}
            <Image
              src="/images/close.svg"
              width={22}
              height={22}
              alt={closeButtonAltText}
            />
          </div>
          <hr />
          <p className="font-ray text-sm font-medium text-black">
            {descriptionText}
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onConfirm}
            className="font-aria h-9.5 w-33 cursor-pointer rounded-[5px] bg-[#161A1D] text-sm font-bold text-white"
          >
            {confirmButtonText}
          </button>
          <button
            onClick={onClose}
            className="font-aria h-9.5 w-33 cursor-pointer text-sm font-bold text-black"
          >
            {cancelButtonText}
          </button>
        </div>
      </div>
    </div>
  )
}
