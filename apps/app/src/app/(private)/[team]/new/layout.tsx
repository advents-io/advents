import { Metadata } from 'next'
import React from 'react'

import { PageContainer } from '@/components/page-container'
import { Card, CardHeader } from '@/ui/card'

export const metadata: Metadata = {
  title: 'Novo app | Advents',
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer title='Novo app'>
      <Card>
        <CardHeader className='mx-auto max-w-xl gap-8 p-4 md:p-10'>{children}</CardHeader>
      </Card>
    </PageContainer>
  )
}
