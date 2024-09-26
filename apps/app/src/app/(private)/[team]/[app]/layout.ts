import { prisma } from '@advents/db'
import { redirect } from 'next/navigation'

import { routes } from '@advents/common'

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { team: string; app: string }
}) {
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
