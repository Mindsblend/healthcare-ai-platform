'use client'

import { useState } from 'react'
import { requestOtp } from '@/features/auth/actions/requestOtpAction'
import { verifyOtp } from '@/features/auth/actions/verifyOtpAction'
import { ErrorCode } from '@/lib/errors'

export function useOtpAuth() {
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<'idle' | 'sent' | 'verified'>('idle')
  const [error, setError] = useState<string | null>(null)

  const getErrorMessage = (code: string) => {
    const entry = Object.values(ErrorCode).find((e) => e.code === code)
    return entry?.message || 'خطایی رخ داده است'
  }

  const sendCode = async (identifier: string) => {
    setLoading(true)
    setError(null)
    try {
      await requestOtp({ identifier: identifier })
      setStage('sent')
    } catch (e: any) {
      setError(getErrorMessage(e.message))
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (identifier: string, code: string) => {
    setLoading(true)
    setError(null)
    try {
      await verifyOtp({ identifier: identifier, code })
      setStage('verified')
      return true
    } catch (e: any) {
      setError(getErrorMessage(e.message))
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

  const getButtonText = () => {
    if (stage === 'idle') return loading ? 'در حال ارسال...' : 'دریافت کد ورود'
    if (stage === 'sent') return 'تأیید کد'
    if (stage === 'verified') return 'ورود موفق'
  }

  return {
    handleOtpButton,
    getButtonText,
    loading,
    stage,
    error,
  }
}
