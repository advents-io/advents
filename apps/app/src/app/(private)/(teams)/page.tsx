import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase/server'
import { UsersIcon } from 'lucide-react'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import {
  EmptyScreen,
  EmptyScreenDescription,
  EmptyScreenIcon,
  EmptyScreenTitle,
} from '@/components/empty-screen'

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
      <EmptyScreen>
        <EmptyScreenIcon>
          <UsersIcon />
        </EmptyScreenIcon>

        <EmptyScreenTitle>Time não encontrado</EmptyScreenTitle>

        <EmptyScreenDescription>
          Não conseguimos encontrar um time associado ao seu usuário.
          <br />
          <br />
          Isso pode ser porque você ainda não foi convidado para um time, ou houve um erro de
          processamento.
        </EmptyScreenDescription>
      </EmptyScreen>
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
