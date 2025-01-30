import { prisma } from '@advents/db'
import { getAppDomains } from '@advents/queries/server'

import { Separator } from '@/ui/separator'

import { AddCustomDomainForm } from './add-custom-domain-form'
import { DomainList } from './domain-list'
import { EditDomainConfigForm } from './edit-domain-config-form'

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
      subDomain: true,
      defaultDomain: true,
    },
  })

  if (!app) {
    return null
  }

  const domains = await getAppDomains(app.id)

  return (
    <div className='space-y-10'>
      <EditDomainConfigForm
        availableDomains={domains}
        defaultDomain={app.defaultDomain}
        subDomain={app.subDomain}
      />

      <Separator />

      <AddCustomDomainForm />

      <DomainList domains={domains} />
    </div>
  )
}
