import { Metadata } from 'next'
import { Suspense } from 'react'

import { LoadingPageContent } from '@/components/loading-page-content'

import { CreateLinkDialog } from './create-link-dialog'
import { LinkList } from './link-list'

export const metadata: Metadata = {
  title: 'Links | Advents',
}

export default async function Links(props: {
  searchParams: Promise<{ page?: string }>
  params: Promise<{ app: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
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
