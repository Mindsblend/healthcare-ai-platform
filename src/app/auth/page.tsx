'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useOtpAuth } from '@/features/auth/hooks/useOtpAuth'

export default function Auth() {
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const { handleOtpButton, getButtonText, loading, stage, error } = useOtpAuth()

  const isOtpComplete = otp.length === 6

  return (
    <div className="flex min-h-screen flex-col items-center gap-4 px-4 pt-16 text-center">
      <Image src="/images/logo.svg" alt="Logo" width={200} height={40} />

      <h1 className="font-aria text-color-title-on-light mt-16 max-w-[474px] text-[40px] leading-12 font-extrabold">
        سفر سلامتی‌ات از همین‌جا ادامه پیدا می‌کند
      </h1>

      <p className="font-ray text-color-body-on-light max-w-[565px] text-[22px]">
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
          className="font-ray text-color-title-on-light h-[60px] w-[458px] rounded-[10px] bg-[#F4F4F4] p-3 text-right text-[22px]"
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
              className="font-ray mt-4 h-[60px] w-[458px] rounded-[10px] bg-[#F4F4F4] p-3 text-center text-[22px] tracking-widest"
            />
          )}
        </AnimatePresence>

        {/* Single button */}
        <button
          disabled={loading || (stage === 'sent' && !isOtpComplete)}
          onClick={() => handleOtpButton(identifier, otp)}
          className={`font-ray mt-4 h-20 w-[458px] cursor-pointer rounded-[10px] text-[20px] font-bold text-white transition-colors hover:bg-gray-800 ${
            stage === 'sent' && !isOtpComplete
              ? 'cursor-not-allowed bg-gray-400'
              : 'bg-black'
          }`}
        >
          {getButtonText()}
        </button>

        {/* Optional error message */}
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </div>
    </div>
  )
}
