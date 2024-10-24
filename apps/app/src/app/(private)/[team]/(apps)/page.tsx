import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase'
import { PlusIcon, Smartphone } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Button } from '@/ui/button'
import { Card, CardContent } from '@/ui/card'

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
    },
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <div className='flex flex-1 flex-col'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Apps</h1>

        <Link href={routes.APPS_NEW.path(team.slug)}>
          <Button size='lg'>
            <PlusIcon className='mr-2 size-4' />
            Criar app
          </Button>
        </Link>
      </div>

      {apps.length === 0 ? (
        <div className='mx-auto'>
          <div className='flex h-72 max-w-72 flex-col justify-center'>
            <div className='w-fit rounded-lg border bg-gray-50 p-2 shadow-md'>
              <Smartphone className='h-8 w-8' />
            </div>

            <span className='mt-6 text-xl font-semibold'>Apps</span>
            <span className='mt-4 text-sm text-muted-foreground'>
              Crie seu primeiro app para começar a utilizar a Advents!
            </span>

            <Link className='mt-6' href={routes.APPS_NEW.path(team.slug)}>
              <Button size='sm'>Criar novo app</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {apps.map((app, index) => (
            <Link href={routes.LINKS.path(team.slug, app.slug)} key={index}>
              <Card>
                <CardContent className='flex items-center gap-4 py-6 text-lg'>
                  <Image
                    src={app.imageUrl}
                    alt={app.name}
                    width={40}
                    height={40}
                    className='rounded-full'
                  />
                  {app.name}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
