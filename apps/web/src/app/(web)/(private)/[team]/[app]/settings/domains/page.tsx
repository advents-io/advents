import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'

import { Separator } from '@/ui/separator'

import { AddCustomDomainForm } from './add-custom-domain-form'
import { DomainList } from './domain-list'
import { EditDefaultDomainForm } from './edit-default-domain-form'

export default async function Page({ params }: { params: Promise<{ team: string; app: string }> }) {
  const { team: teamSlug, app: appSlug } = await params

  const app = await prisma.app.findFirst({
    where: {
      slug: appSlug,
      team: {
        slug: teamSlug,
      },
    },
    select: {
      id: true,
      defaultDomain: true,
    },
  })

  if (!app) {
    return null
  }

  const domains = await getAppDomains(app.id)

  return (
    <div className='space-y-10'>
      <EditDefaultDomainForm availableDomains={domains} defaultDomain={app.defaultDomain} />

      <Separator />

      <AddCustomDomainForm />

      <DomainList domains={domains} />
    </div>
  )
}
