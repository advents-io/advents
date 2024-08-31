import { PrivateHeader } from '@/components/private-header'
import { supabaseClient } from '@/lib/supabase'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await supabaseClient().auth.getUser()
  const email = user.data.user?.email

  return (
    <>
      <PrivateHeader email={email} />
      {children}
    </>
  )
}
