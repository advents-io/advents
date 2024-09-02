import { PrivateHeader } from '@/components/private-header'
import { prisma } from '@/lib/prisma'
import { supabaseClient } from '@/lib/supabase'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await supabaseClient().auth.getUser()
  const email = user.data.user?.email
  const userId = user.data.user?.id

  const apps = await prisma.app.findMany({
    where: {
      team: {
        members: {
          some: {
            userId,
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <>
      <PrivateHeader email={email} apps={apps} />
      {children}
    </>
  )
}
