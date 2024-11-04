import { Metadata } from 'next'
import { Suspense } from 'react'

import { PageContainer } from '@/components/page-container'

import { CreateLinkDialog } from './create-link-dialog'
import { LinkList } from './link-list'
import { LinkListLoading } from './link-list-loading'

export const metadata: Metadata = {
  title: 'Links | Advents',
}

export default async function Page(props: {
  searchParams: Promise<{ page?: string }>
  params: Promise<{ app: string; team: string }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams
  const page = Number(searchParams.page) || 1

  return (
    <PageContainer title='Links' actions={<CreateLinkDialog />}>
      <Suspense fallback={<LinkListLoading />}>
        <LinkList page={page} appSlug={params.app} teamSlug={params.team} />
      </Suspense>
    </PageContainer>
  )
}
