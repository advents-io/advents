import { Metadata } from 'next'

import { PageContainer } from '@/components/page-container'

import { CreateAppForm } from './create-app-form'

export const metadata: Metadata = {
  title: 'Novo app | Advents',
}

export default async function Page() {
  return (
    <PageContainer title='Novo app'>
      <CreateAppForm />
    </PageContainer>
  )
}
