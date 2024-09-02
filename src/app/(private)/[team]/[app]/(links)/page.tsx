import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

import { CreateLinkDialog } from '@/components/create-link-dialog'
import { LinkList } from '@/components/link-list'
import { LoadingLinkList } from '@/components/loading-link-list'
import { prisma } from '@/lib/prisma'
import { routes } from '@/utils/routes'

export const metadata: Metadata = {
  title: 'Links | Advents',
}

export default async function Links({
  searchParams,
  params,
}: {
  searchParams: { page?: string }
  params: { team: string; app: string }
}) {
  const app = await prisma.app.findFirst({
    where: {
      slug: params.app,
    },
    select: {
      id: true,
    },
  })

  if (!app) {
    redirect(routes.APPS.path(params.team))
  }

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
