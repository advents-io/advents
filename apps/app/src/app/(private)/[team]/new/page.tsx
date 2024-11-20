import { Metadata } from 'next'

import { PageContainer } from '@/components/page-container'
import { Card, CardHeader } from '@/ui/card'

import { CreateAppForm } from './create-app-form'

export const metadata: Metadata = {
  title: 'Novo app | Advents',
}

export default async function Page() {
  return (
    <PageContainer title='Novo app'>
      <Card>
        <CardHeader className='mx-auto max-w-xl gap-8 p-4 md:p-10'>
          <CreateAppForm />
        </CardHeader>
      </Card>
    </PageContainer>
  )
}
