import { getSession } from '@/features/auth/services/sessionService'
import Sidebar from './contents/Sidebar'
import { redirect } from 'next/navigation'

export default async function Home() {
  const user = await getSession()

  if (!user) {
    redirect('/auth')
  } else {
    return <Sidebar />
  }
}
