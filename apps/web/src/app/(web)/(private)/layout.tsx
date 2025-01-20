import { prisma } from '@advents/db'
import { getSessionUser } from '@advents/supabase/server'

import { PrivateHeader } from './private-header'

export default async function Layout({ children }: { children: React.ReactNode }) {
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
      team: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  const teamsRecord = apps.reduce<
    Record<
      string,
      {
        name: string
        slug: string
        apps: {
          id: string
          name: string
          slug: string
          imageUrl: string
        }[]
      }
    >
  >((acc, app) => {
    const teamSlug = app.team.slug

    if (!acc[teamSlug]) {
      acc[teamSlug] = {
        name: app.team.name,
        slug: app.team.slug,
        apps: [],
      }
    }

    acc[teamSlug].apps.push({
      id: app.id,
      name: app.name,
      slug: app.slug,
      imageUrl: app.imageUrl,
    })

    return acc
  }, {})

  const teams = Object.values(teamsRecord)

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
