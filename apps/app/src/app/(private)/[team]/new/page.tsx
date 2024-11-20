import { Metadata } from 'next'

import { CreateEditAppForm } from '@/components/create-edit-app-form'
import { PageContainer } from '@/components/page-container'
import { Card, CardHeader } from '@/ui/card'

export const metadata: Metadata = {
  title: 'Novo app | Advents',
}

export default async function Page() {
  return (
    <PageContainer title='Novo app'>
      <Card>
        <CardHeader className='mx-auto max-w-xl gap-8 p-4 md:p-10'>
          <CreateEditAppForm />
        </CardHeader>
      </Card>
    </PageContainer>
  )
}
