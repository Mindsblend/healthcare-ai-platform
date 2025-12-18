import { getSession } from '@/features/auth/services/sessionService'
import AuthFormSection from '@/components/domain/auth/AuthFormSection'
import { redirect } from 'next/navigation'

export default async function Auth() {
  const user = await getSession()

  if (!user) {
    return <AuthFormSection />
  } else {
    redirect('/')
  }
}
