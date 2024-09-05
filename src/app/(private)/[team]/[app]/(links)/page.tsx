import { Metadata } from 'next'
import { Suspense } from 'react'

import { CreateLinkDialog } from '@/components/create-link-dialog'
import { LinkList } from '@/components/link-list'
import { LoadingPageContent } from '@/components/loading-page-content'

export const metadata: Metadata = {
  title: 'Links | Advents',
}

export default async function Links({
  searchParams,
  params,
}: {
  searchParams: { page?: string }
  params: { app: string }
}) {
  const page = Number(searchParams.page) || 1

  return (
    <div className='flex flex-1 flex-col'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Links</h1>

        <CreateLinkDialog />
      </div>

      <Suspense fallback={<LoadingPageContent className='mt-6' />}>
        <LinkList page={page} appSlug={params.app} />
      </Suspense>
    </div>
  )
}
