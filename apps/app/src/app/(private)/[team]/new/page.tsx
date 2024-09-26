import { prisma } from '@advents/db'
import { supabaseClient } from '@advents/supabase'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { CreateEditAppForm } from '@/components/create-edit-app-form'
import { routes } from '@/utils/routes'

export const metadata: Metadata = {
  title: 'Novo app | Advents',
}

export default async function NewApp({ params: { team: teamSlug } }: { params: { team: string } }) {
  const supabase = supabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect(routes.SIGN_IN.path)
  }

  const team = await prisma.team.findFirst({
    where: {
      slug: teamSlug,
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

  return (
    <div className='mx-auto max-w-xl'>
      <h1 className='mb-4 text-xl font-bold'>Novo app</h1>

      <CreateEditAppForm />
    </div>
  )
}
