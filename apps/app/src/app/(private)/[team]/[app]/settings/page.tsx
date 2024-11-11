import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'
import { redirect } from 'next/navigation'
import React from 'react'

import { CreateEditAppForm } from '@/components/create-edit-app-form'

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
      defaultDomain: true,
      androidUrl: true,
      iosUrl: true,
      defaultFallbackUrl: true,
      qrcodeLogoUrl: true,
    },
  })

  if (!app) {
    redirect(routes.APPS.path(params.team))
  }

  const availableDomains = await getAppDomains(app.id)

  return <CreateEditAppForm app={app} availableDomains={availableDomains} />
}
