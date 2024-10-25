import { Metadata } from 'next'
import { Suspense } from 'react'

import { LoadingPageContent } from '@/components/loading-page-content'
import { PageContainer } from '@/components/page-container'

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
    <PageContainer title='Links' actions={<CreateLinkDialog />}>
      <Suspense fallback={<LoadingPageContent />}>
        <LinkList page={page} appSlug={params.app} />
      </Suspense>
    </PageContainer>
  )
}
