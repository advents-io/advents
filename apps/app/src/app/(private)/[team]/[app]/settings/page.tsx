import { routes } from '@advents/common'
import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'
import { redirect } from 'next/navigation'
import React from 'react'

import { Card, CardHeader } from '@/ui/card'

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
      defaultDomain: true,
      androidUrl: true,
      iosUrl: true,
      defaultDisableIosPreviewPage: true,
      defaultFallbackUrl: true,
      qrcodeLogoUrl: true,
    },
  })

  if (!app) {
    redirect(routes.APPS.path(params.team))
  }

  const availableDomains = await getAppDomains(app.id)

  return (
    <Card>
      <CardHeader className='mx-auto max-w-xl gap-8 p-4 md:p-10'>
        <EditAppForm app={app} availableDomains={availableDomains} />
      </CardHeader>
    </Card>
  )
}
