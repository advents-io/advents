import { Metadata } from 'next'

import { PageContainer } from '@/components/page-container'

import { DatePicker } from './date-picker'
import { Metrics } from './metrics'
import { Table } from './table'

export const metadata: Metadata = {
  title: 'Analytics | Advents',
}

export default async function Page(props: { params: Promise<{ app: string; team: string }> }) {
  const params = await props.params

  return (
    <PageContainer title='Analytics' actions={<DatePicker />} className='gap-4'>
      <Metrics appSlug={params.app} teamSlug={params.team} />

      <Table className='mt-10' appSlug={params.app} teamSlug={params.team} />
    </PageContainer>
  )
}
