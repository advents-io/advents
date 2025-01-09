import { Metadata } from 'next'

import { PageContainer } from '@/components/page-container'

import { DatePicker } from './date-picker'
import { Metrics } from './metrics'
import { Table } from './table'

export const metadata: Metadata = {
  title: 'Analytics | Advents',
}

export default async function Page(props: { params: Promise<{ team: string; app: string }> }) {
  const params = await props.params

  return (
    <PageContainer title='Analytics' actions={<DatePicker />} className='gap-4'>
      <Metrics teamSlug={params.team} appSlug={params.app} />

      <Table className='mt-10' teamSlug={params.team} appSlug={params.app} />
    </PageContainer>
  )
}
