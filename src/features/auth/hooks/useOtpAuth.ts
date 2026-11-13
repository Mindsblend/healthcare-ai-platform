'use client'

import { useEffect, useState } from 'react'
import { requestOtp } from '@/features/auth/actions/requestOtpAction'
import { verifyOtp } from '@/features/auth/actions/verifyOtpAction'
import { ErrorCode } from '@/lib/errors'

const RESEND_COOLDOWN_SECONDS = 30

export function useOtpAuth() {
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  const [stage, setStage] = useState<'idle' | 'sent' | 'verified'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (resendCountdown === 0) return

    const timer = window.setTimeout(() => {
      setResendCountdown((remaining) => remaining - 1)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [resendCountdown])

  const getErrorMessage = (code: string) => {
    const entry = Object.values(ErrorCode).find((e) => e.code === code)
    return entry?.message || 'خطایی رخ داده است'
  }

  const sendCode = async (identifier: string, isResend = false) => {
    setLoading(true)
    setResending(isResend)
    setError(null)
    try {
      await requestOtp({ identifier })
      setStage('sent')
      setResendCountdown(RESEND_COOLDOWN_SECONDS)
    } catch (e: unknown) {
      setError(getErrorMessage(e instanceof Error ? e.message : 'UNKNOWN'))
    } finally {
      setLoading(false)
      setResending(false)
    }
  }

  const verifyCode = async (identifier: string, code: string) => {
    setLoading(true)
    setError(null)
    try {
      await verifyOtp({ identifier: identifier, code })
      setStage('verified')
      return true
    } catch (e: unknown) {
      setError(getErrorMessage(e instanceof Error ? e.message : 'UNKNOWN'))
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleOtpButton = async (identifier: string, otp: string) => {
    if (stage === 'idle') {
      await sendCode(identifier)
    } else if (stage === 'sent' && otp.length === 6) {
      await verifyCode(identifier, otp)
    }
  }

  const resendCode = async (identifier: string) => {
    if (resendCountdown > 0 || loading) return
    await sendCode(identifier, true)
  }

  const reset = () => {
    setStage('idle')
    setError(null)
    setResendCountdown(0)
  }

  const getButtonText = () => {
    if (stage === 'idle') return loading ? 'در حال ارسال...' : 'دریافت کد ورود'
    if (stage === 'sent') return loading ? 'در حال بررسی...' : 'تأیید و ورود'
    if (stage === 'verified') return 'ورود موفق'
  }

  return {
    handleOtpButton,
    resendCode,
    reset,
    clearError: () => setError(null),
    getButtonText,
    loading,
    resending,
    resendCountdown,
    stage,
    error,
  }
}
