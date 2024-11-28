import { Suspense } from 'react'

import { AddCustomDomainForm } from './add-custom-domain-form'
import { DomainList, DomainListSkeleton } from './domain-list'

export default async function Page({ params }: { params: Promise<{ team: string; app: string }> }) {
  const { team, app } = await params

  return (
    <div>
      <AddCustomDomainForm />

      <div className='mt-10'>
        <Suspense fallback={<DomainListSkeleton />}>
          <DomainList teamSlug={team} appSlug={app} />
        </Suspense>
      </div>
    </div>
  )
}
