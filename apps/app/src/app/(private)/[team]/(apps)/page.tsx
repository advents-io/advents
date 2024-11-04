import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase/server'
import { PlusIcon, SmartphoneIcon } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

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

export default async function Apps(props: { params: Promise<{ team: string }> }) {
  const params = await props.params

  const supabase = await supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const team = await prisma.team.findFirst({
    where: {
      members: {
        some: {
          userId: session?.user.id,
        },
      },
      slug: params.team,
    },
    select: {
      id: true,
      slug: true,
    },
  })

  if (!team) {
    return redirect(routes.TEAMS.path)
  }

  const apps = await prisma.app.findMany({
    where: {
      teamId: team.id,
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
        <Link href={routes.APPS_NEW.path(team.slug)}>
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

          <Link href={routes.APPS_NEW.path(team.slug)}>
            <EmptyScreenButton>Criar novo app</EmptyScreenButton>
          </Link>
        </EmptyScreen>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {apps.map((app, index) => (
            <AppCard key={index} app={app} teamSlug={team.slug} />
          ))}
        </div>
      )}
    </PageContainer>
  )
}
