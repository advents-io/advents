import Link from 'next/link'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { supabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { routes } from '@/utils/routes'

export default async function Apps() {
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
    },
    orderBy: {
      name: 'asc',
    },
  })

  if (apps.length === 0) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Nenhum app encontrado</CardTitle>
            <CardDescription>Não encontramos nenhum app associado ao seu time.</CardDescription>
          </CardHeader>
          <CardContent className='text-sm'>
            Isso pode ocorrer se você ainda não criou um app para este time ou se houve um erro no
            processamento dos dados do seu time.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='flex flex-1 flex-col p-8 md:p-14'>
      <h1 className='mb-4 text-xl font-bold'>Apps</h1>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {apps.map((app, index) => (
          <Link href={routes.LINKS.path(team.slug, app.slug)} key={index}>
            <Card>
              <CardContent className='py-6 text-lg'>{app.name}</CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
