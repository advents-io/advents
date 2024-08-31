import { Metadata } from 'next'
import { Suspense } from 'react'

import { CreateLinkDialog } from '@/components/create-link-dialog'
import { LinkList } from '@/components/link-list'
import { LoadingLinkList } from '@/components/loading-link-list'

export const metadata: Metadata = {
  title: 'Links | Advents',
}

export default async function Links({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1

  return (
    <main className='flex flex-1 flex-col p-8 md:p-14'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Links</h1>

        <CreateLinkDialog />
      </div>

      <Suspense fallback={<LoadingLinkList />}>
        <LinkList page={page} />
      </Suspense>
    </main>
  )
}
