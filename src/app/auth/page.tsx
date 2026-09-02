import { getSession } from '@/features/auth/services/sessionService'
import AuthFormSection from '@/components/domain/auth/AuthFormSection'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ورود به حساب کاربری',
  robots: { index: false, follow: false },
}

export default async function Auth() {
  const user = await getSession()

  if (!user) {
    return <AuthFormSection />
  } else {
    redirect('/')
  }
}
