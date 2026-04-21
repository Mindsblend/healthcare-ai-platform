'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useOtpAuth } from '@/features/auth/hooks/useOtpAuth'
import ErrorPopup from '@/components/layout/ErrorPopup'

export default function AuthFormSection() {
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const { handleOtpButton, getButtonText, loading, stage, error } = useOtpAuth()
  const isOtpComplete = otp.length === 6

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 px-4 text-center">
        <Image src="/images/logo.svg" alt="Logo" width={200} height={40} />

        <h1 className="font-aria text-color-title-on-light mt-8 max-w-xs text-3xl font-extrabold sm:max-w-xl sm:text-5xl">
          سفر سلامتی‌ات از همین‌جا ادامه پیدا می‌کند
        </h1>

        <p className="font-ray text-color-body-on-light max-w-xl text-sm sm:text-xl">
          وارد حساب شو و کنترل سلامتی‌ات را در دست بگیر <br />
          از تحلیل هوش مصنوعی تا محصولاتی که برای کیفیت بی‌نقص انتخاب شده
        </p>

        <div className="mt-4 flex flex-col items-center">
          {/* Identifier */}
          <input
            type="text"
            placeholder="ایمیل یا شماره تلفن"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="font-ray text-color-title-on-light h-15 w-70.75 rounded-[10px] bg-[#F4F4F4] p-3 text-right text-xl sm:h-15 sm:w-114.5"
          />

          {/* OTP appears directly under identifier */}
          <AnimatePresence>
            {(stage === 'sent' || stage === 'verified') && (
              <motion.input
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="کد تأیید"
                className="font-ray text-color-title-on-light mt-4 h-15 w-70.75 rounded-[10px] bg-[#F4F4F4] p-3 text-center text-xl tracking-widest sm:h-15 sm:w-114.5"
              />
            )}
          </AnimatePresence>

          {/* Single button */}
          <button
            disabled={loading || (stage === 'sent' && !isOtpComplete)}
            onClick={() => handleOtpButton(identifier, otp)}
            className={`font-ray mt-4 h-15 w-70.75 cursor-pointer rounded-[10px] text-lg font-bold text-white transition-colors hover:bg-gray-800 sm:h-20 sm:w-114.5 ${
              stage === 'sent' && !isOtpComplete
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-black'
            }`}
          >
            {getButtonText()}
          </button>

          {/* Error Popup in case of facing errors */}
          <ErrorPopup error={error} />
        </div>
      </div>
    </div>
  )
}
