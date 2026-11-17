'use client'

import { useState, type FormEvent } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useOtpAuth } from '@/features/auth/hooks/useOtpAuth'
import InformPopup from '@/components/layout/InformPopup'

const normalizeDigits = (value: string) =>
  value
    .replace(/[۰-۹]/g, (digit) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(digit)))

const maskIdentifier = (identifier: string) => {
  if (identifier.includes('@')) {
    const [username, domain] = identifier.split('@')
    return `${username.slice(0, 1)}•••@${domain}`
  }

  const digits = normalizeDigits(identifier).replace(/\D/g, '')
  return digits.length >= 7
    ? `${digits.slice(0, 3)}••••${digits.slice(-4)}`
    : identifier
}

export default function AuthFormSection() {
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const {
    handleOtpButton,
    resendCode,
    reset,
    clearError,
    getButtonText,
    loading,
    resending,
    resendCountdown,
    stage,
    error,
  } = useOtpAuth()
  const isOtpComplete = otp.length === 6

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void handleOtpButton(identifier.trim(), otp)
  }

  const editIdentifier = () => {
    reset()
    setOtp('')
  }

  const [isOtpFocused, setIsOtpFocused] = useState(false)

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center px-4 pb-3">
      <div className="flex flex-col items-center gap-4 px-4 text-center">
        <Image src="/images/logo.svg" alt="Logo" width={200} height={40} />

        <h1 className="font-aria text-color-title-on-light mt-2 max-w-xs text-3xl font-extrabold sm:max-w-xl sm:text-5xl">
          سفر سلامتی‌ات از همین‌جا ادامه پیدا می‌کند
        </h1>

        <p className="font-ray text-color-body-on-light max-w-xl text-sm sm:text-xl">
          وارد حساب شو و کنترل سلامتی‌ات را در دست بگیر <br />
          از تحلیل هوش مصنوعی تا محصولاتی که برای کیفیت بی‌نقص انتخاب شده
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col items-center"
        >
          <input
            type="text"
            aria-label="ایمیل یا شماره تلفن"
            placeholder="ایمیل یا شماره تلفن"
            value={identifier}
            disabled={stage !== 'idle' || loading}
            onChange={(event) => {
              setIdentifier(normalizeDigits(event.target.value))
              clearError()
            }}
            className="font-ray text-color-title-on-light mx-1.5 h-15 w-full rounded-xl border border-[#E8E8E8] bg-[#F7F7F7] pr-4 pl-4 text-right text-base transition-all duration-200 outline-none placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-500 focus:bg-white focus:ring-4 focus:ring-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
          />

          <AnimatePresence>
            {(stage === 'sent' || stage === 'verified') && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <p
                  className="font-ray mt-3 text-center text-sm text-gray-600"
                  aria-live="polite"
                >
                  کد برای <span dir="ltr">{maskIdentifier(identifier)}</span>{' '}
                  ارسال شد.
                </p>

                <div
                  className="relative m-1.5 mt-4 w-70.75 sm:w-114.5"
                  dir="ltr"
                >
                  {/* Visual OTP cells */}
                  <div className="grid grid-cols-6 gap-2" aria-hidden="true">
                    {Array.from({ length: 6 }).map((_, index) => {
                      const digit = otp[index]
                      const isActive =
                        isOtpFocused && index === otp.length && otp.length < 6

                      return (
                        <div
                          key={index}
                          className={`relative flex aspect-square items-center justify-center rounded-xl border transition-all duration-200 ease-out ${
                            isActive
                              ? 'scale-[1.04] border-gray-800 bg-white ring-4 ring-black/[0.05]'
                              : digit
                                ? 'border-gray-300 bg-white shadow-sm'
                                : 'border-[#E5E5E5] bg-[#F5F5F5]'
                          } `}
                        >
                          {digit ? (
                            <motion.span
                              key={`${index}-${digit}`}
                              initial={{ opacity: 0, y: 8, scale: 0.8 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              transition={{ duration: 0.18 }}
                              className="font-ray text-color-title-on-light text-2xl font-bold"
                            >
                              {digit}
                            </motion.span>
                          ) : isActive ? (
                            <span className="h-7 w-0.5 animate-pulse rounded-full bg-gray-800" />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Real input: Autofill, keyboard and paste support */}
                  <input
                    type="text"
                    aria-label="کد تأیید شش رقمی"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onFocus={() => setIsOtpFocused(true)}
                    onBlur={() => setIsOtpFocused(false)}
                    onChange={(event) => {
                      setOtp(
                        normalizeDigits(event.target.value)
                          .replace(/\D/g, '')
                          .slice(0, 6),
                      )
                      clearError()
                    }}
                    className="absolute inset-0 z-10 h-full w-full cursor-text opacity-[0.01]"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={
              loading ||
              (stage === 'idle' && !identifier.trim()) ||
              (stage === 'sent' && !isOtpComplete) ||
              stage === 'verified'
            }
            className={`font-ray mt-4 h-15 w-70.75 cursor-pointer rounded-[10px] text-lg font-bold text-white transition-colors hover:bg-gray-800 sm:h-20 sm:w-114.5 ${
              (stage === 'sent' && !isOtpComplete) || loading
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-black'
            }`}
          >
            {getButtonText()}
          </button>
        </form>

        {stage === 'sent' && (
          <div className="font-ray flex flex-wrap items-center justify-center gap-2 text-sm">
            <button
              type="button"
              disabled={loading || resendCountdown > 0}
              onClick={() => void resendCode(identifier.trim())}
              className="text-color-title-on-light font-bold underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
            >
              {resending ? 'در حال ارسال کد...' : 'ارسال دوباره کد'}
            </button>
            {resendCountdown > 0 && (
              <span className="text-gray-500" aria-live="polite">
                ({resendCountdown} ثانیه دیگر)
              </span>
            )}
            <button
              type="button"
              disabled={loading}
              onClick={editIdentifier}
              className="font-bold text-gray-600 underline-offset-4 hover:underline disabled:cursor-not-allowed"
            >
              ویرایش ایمیل یا شماره
            </button>
          </div>
        )}

        <InformPopup message={error} />
      </div>
    </div>
  )
}
