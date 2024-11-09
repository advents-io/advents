import { getLinkDomains } from '@advents/queries/server'

import { CreateEditAppForm } from '@/components/create-edit-app-form'

export default async function Page() {
  const availableDomains = await getLinkDomains()

  return <CreateEditAppForm availableDomains={availableDomains} />
}
