import { getSession } from '@/features/auth/services/sessionService'
import AuthFormSection from '@/components/domain/auth/AuthFormSection'
import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ورود به حساب کاربری',
  robots: { index: false, follow: false },
}

export default async function Auth({
  searchParams,
}: Readonly<{
  searchParams: { [key: string]: string | string[] | undefined }
}>) {
  const user = await getSession()

  const callbackUrl =
    (typeof searchParams.callbackUrl === 'string'
      ? searchParams.callbackUrl
      : typeof searchParams.from === 'string'
        ? searchParams.from
        : '/') || '/'

  if (!user) {
    return <AuthFormSection callbackUrl={callbackUrl} />
  } else {
    redirect('/')
  }
}
