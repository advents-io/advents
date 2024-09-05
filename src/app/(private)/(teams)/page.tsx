import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { supabaseClient } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card'
import { routes } from '@/utils/routes'

export const metadata: Metadata = {
  title: 'Equipe | Advents',
}

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

  return redirect(routes.APPS.path(team.slug))
}
