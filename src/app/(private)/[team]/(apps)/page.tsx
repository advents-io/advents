import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { supabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { routes } from '@/utils/routes'

export default async function Apps({ params }: { params: { team: string } }) {
  const supabase = supabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect(routes.SIGN_IN.path)
  }

  const team = await prisma.team.findUnique({
    where: {
      slug: params.team,
    },
    select: {
      id: true,
    },
  })

  if (!team) {
    return redirect(routes.TEAMS.path)
  }

  const app = await prisma.app.findFirst({
    where: {
      teamId: team.id,
    },
    select: { slug: true },
  })

  if (!app) {
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

  return redirect(routes.LINKS.path(params.team, app.slug))
}
