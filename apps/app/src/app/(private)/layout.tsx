import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase'

import { PrivateHeader } from './private-header'

export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const {
    data: { session },
  } = await supabaseServer().auth.getSession()

  const email = session?.user.email
  const userId = session?.user.id

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
      <div className='px-4 py-8 md:p-14 md:px-18'>{children}</div>
    </>
  )
}
