import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { supabaseServer } from '@advents/supabase'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CreateEditAppForm } from '@/components/create-edit-app-form'

export const metadata: Metadata = {
  title: 'Novo app | Advents',
}

export default async function NewApp(props: { params: Promise<{ team: string }> }) {
  const { team: teamSlug } = await props.params

  const supabase = await supabaseServer()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const team = await prisma.team.findFirst({
    where: {
      slug: teamSlug,
      members: {
        some: {
          userId: session?.user.id,
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

  return (
    <div className='mx-auto max-w-xl'>
      <h1 className='mb-4 text-xl font-bold'>Novo app</h1>

      <CreateEditAppForm />
    </div>
  )
}
