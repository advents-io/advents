import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { redirect } from 'next/navigation'
import React from 'react'

import { EditAppForm } from './edit-app-form'

export default async function Page(props: { params: Promise<{ team: string; app: string }> }) {
  const params = await props.params

  const app = await prisma.app.findFirst({
    where: {
      slug: params.app,
      team: {
        slug: params.team,
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      androidUrl: true,
      iosUrl: true,
      disableIosPreviewPage: true,
      fallbackUrl: true,
    },
  })

  if (!app) {
    redirect(routes.APPS.path(params.team))
  }

  return <EditAppForm app={app} />
}
