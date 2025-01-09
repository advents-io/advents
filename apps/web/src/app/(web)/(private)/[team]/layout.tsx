import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { getSessionUser } from '@advents/supabase/server'
import { redirect } from 'next/navigation'

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ team: string }>
}) {
  const user = await getSessionUser()

  const { team: teamSlug } = await props.params

  const team = await prisma.team.findFirst({
    where: {
      slug: teamSlug,
      members: {
        some: {
          userId: user?.id,
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!team) {
    redirect(routes.TEAMS.path)
  }

  return props.children
}
