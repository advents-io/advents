import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { getSessionUser } from '@advents/supabase/server'
import { redirect } from 'next/navigation'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ team: string; app: string }>
}) {
  const params = await props.params

  const { children } = props

  const app = await prisma.app.findFirst({
    where: {
      slug: params.app,
      team: {
        slug: params.team,
      },
    },
    select: {
      id: true,
    },
  })

  if (!app) {
    redirect(routes.APPS.path(params.team))
  }

  return children
}
