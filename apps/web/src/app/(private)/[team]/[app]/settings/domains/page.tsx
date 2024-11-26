import { Suspense } from 'react'

import { AddCustomDomainForm } from './add-custom-domain-form'
import { DomainList, DomainListSkeleton } from './domain-list'

export default async function Page({ params }: { params: Promise<{ app: string; team: string }> }) {
  const { app, team } = await params

  return (
    <div>
      <AddCustomDomainForm />

      <div className='mt-10'>
        <Suspense fallback={<DomainListSkeleton />}>
          <DomainList appSlug={app} teamSlug={team} />
        </Suspense>
      </div>
    </div>
  )
}
