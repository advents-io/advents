import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'

export const metadata: Metadata = {
  title: 'Equipe | Advents',
}

export default async function Teams() {
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
    },
    select: { id: true, slug: true },
  })

  if (!team) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <Card className='w-full max-w-md'>
          <CardHeader>
            <CardTitle>Conta não encontrada</CardTitle>
            <CardDescription>
              Não conseguimos encontrar uma conta associada ao seu usuário.
            </CardDescription>
          </CardHeader>
          <CardContent className='text-sm'>
            Isso pode ser porque você ainda não foi convidado para uma conta, ou houve um erro de
            processamento.
          </CardContent>
        </Card>
      </div>
    )
  }

  const app = await prisma.app.findFirst({
    where: {
      team: {
        id: team.id,
      },
    },
    select: { slug: true },
  })

  return redirect(app ? routes.LINKS.path(team.slug, app.slug) : routes.APPS.path(team.slug))
}
