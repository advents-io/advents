import { PlusIcon } from 'lucide-react'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import Empty from '@/assets/illustrations/empty.svg'
import { prisma } from '@/lib/prisma'
import { supabaseClient } from '@/lib/supabase'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { routes } from '@/utils/routes'

export const metadata: Metadata = {
  title: 'Apps | Advents',
}

export default async function Apps({ params }: { params: { team: string } }) {
  const supabase = supabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect(routes.SIGN_IN.path)
  }

  const team = await prisma.team.findFirst({
    where: {
      members: {
        some: {
          userId: user.id,
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
        <div className='flex justify-center'>
          <Card className='w-full max-w-xl'>
            <CardHeader>
              <CardTitle>Nenhum app encontrado</CardTitle>
            </CardHeader>

            <CardContent className='mt-10 flex flex-col items-center gap-10'>
              <Image src={Empty} width={200} height={200} alt='Nenhum app encontrado' />

              <Link href={routes.APPS_NEW.path(team.slug)}>
                <Button size='lg'>
                  <PlusIcon className='mr-2 size-4' />
                  Criar app
                </Button>
              </Link>
            </CardContent>
          </Card>
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
