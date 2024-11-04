import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { getSessionUser } from '@advents/supabase/server'
import { PlusIcon, SmartphoneIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import {
  EmptyScreen,
  EmptyScreenButton,
  EmptyScreenDescription,
  EmptyScreenIcon,
  EmptyScreenTitle,
} from '@/components/empty-screen'
import { PageContainer } from '@/components/page-container'
import { Button } from '@/ui/button'

import { AppCard } from './app-card'

export const metadata: Metadata = {
  title: 'Apps | Advents',
}

export default async function Page(props: { params: Promise<{ team: string }> }) {
  const { team } = await props.params

  const user = await getSessionUser()

  const apps = await prisma.app.findMany({
    where: {
      team: {
        slug: team,
        members: {
          some: {
            userId: user?.id,
          },
        },
      },
    },
    select: {
      name: true,
      slug: true,
      imageUrl: true,
      links: {
        select: {
          clickCount: true,
          installCount: true,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <PageContainer
      title='Apps'
      actions={
        <Link href={routes.APPS_NEW.path(team)}>
          <Button size='lg'>
            <PlusIcon className='mr-2 size-4' />
            Criar app
          </Button>
        </Link>
      }
    >
      {apps.length === 0 ? (
        <EmptyScreen>
          <EmptyScreenIcon>
            <SmartphoneIcon />
          </EmptyScreenIcon>

          <EmptyScreenTitle>Apps</EmptyScreenTitle>

          <EmptyScreenDescription>
            Crie seu primeiro app para começar a utilizar a Advents!
          </EmptyScreenDescription>

          <Link href={routes.APPS_NEW.path(team)}>
            <EmptyScreenButton>Criar novo app</EmptyScreenButton>
          </Link>
        </EmptyScreen>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {apps.map((app, index) => (
            <AppCard key={index} app={app} teamSlug={team} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
