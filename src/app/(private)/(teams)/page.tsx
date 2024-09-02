import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { supabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { routes } from '@/utils/routes'

export default async function Teams() {
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
    select: { id: true, slug: true },
  })

  if (!team) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Time não encontrado</CardTitle>
            <CardDescription>
              Não conseguimos encontrar um time associado à sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className='text-sm'>
            Isso pode ser porque você ainda não foi convidado para um time, ou houve um erro no
            processamento da sua conta.
          </CardContent>
        </Card>
      </div>
    )
  }

  const app = await prisma.app.findFirst({
    where: {
      teamId: team.id,
    },
    select: { slug: true },
  })

  if (!app) {
    return redirect(routes.APPS.path(team.slug))
  }

  return redirect(routes.LINKS.path(team.slug, app.slug))
}
