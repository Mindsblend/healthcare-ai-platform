'use client'

import { useState } from 'react'
import { requestOtp } from '@/features/auth/actions/requestOtpAction'
import { verifyOtp } from '@/features/auth/actions/verifyOtpAction'

export function useOtpAuth() {
  const [loading, setLoading] = useState(false)
  const [stage, setStage] = useState<'idle' | 'sent' | 'verified'>('idle')
  const [error, setError] = useState<string | null>(null)

  const sendCode = async (identifier: string) => {
    setLoading(true)
    setError(null)
    try {
      await requestOtp(identifier) // call your action
      setStage('sent')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async (identifier: string, code: string) => {
    setLoading(true)
    setError(null)
    try {
      const success = await verifyOtp(identifier, code) // action verifies OTP
      if (!success) throw new Error('کد نادرست است')
      setStage('verified')
      return true
    } catch (e: any) {
      setError(e.message)
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
