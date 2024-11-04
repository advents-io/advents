import { prisma } from '@advents/db'
import { getSessionUser } from '@advents/supabase/server'

import { PrivateHeader } from './private-header'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser()

  const email = user?.email
  const userId = user?.id

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
      imageUrl: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <>
      <PrivateHeader email={email} apps={apps} />
      <div className='overflow-x-hidden'>
        <div className='mx-auto w-full max-w-7xl px-4 py-8 md:px-8 lg:px-12 2xl:px-0'>
          {children}
        </div>
      </div>
    </>
  )
}
