import { getAppDomains } from '@advents/queries/server'

import { CreateEditAppForm } from '@/components/create-edit-app-form'

export default async function Page() {
  const availableDomains = await getAppDomains()

  return <CreateEditAppForm availableDomains={availableDomains} />
}
