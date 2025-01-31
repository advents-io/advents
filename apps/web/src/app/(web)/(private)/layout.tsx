import { prisma } from '@advents/db'
import { getSessionUser } from '@advents/supabase/server'

import { PrivateHeader } from './private-header'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()

  const email = user?.email
  const userId = user?.id

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      name: true,
      slug: true,
      apps: {
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
        },
      },
    },
  })

  return (
    <>
      <PrivateHeader email={email} teams={teams} />
      <div className='overflow-x-hidden'>
        <div className='mx-auto w-full max-w-7xl px-4 py-8 md:px-8 lg:px-12 2xl:px-0'>
          {children}
        </div>
      </div>
    </>
  )
}
