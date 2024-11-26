import { Metadata } from 'next'

import { PageContainer } from '@/components/page-container'

import { Layout as LayoutClient } from './layout-client'

export const metadata: Metadata = {
  title: 'Ajustes | Advents',
}

export default async function Layout(props: {
  children: React.ReactNode
  params: Promise<{ team: string; app: string }>
}) {
  const params = await props.params

  const { children } = props

  return (
    <PageContainer title='Ajustes'>
      <LayoutClient team={params.team} app={params.app}>
        {children}
      </LayoutClient>
    </PageContainer>
  )
}
