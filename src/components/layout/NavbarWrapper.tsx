// src/components/layout/NavbarWrapper.tsx
import { getSession } from '@/features/auth/services/sessionService'
import Navbar from './Navbar'

export default async function NavbarWrapper() {
  const user = await getSession()

  return <Navbar user={user} />
}
