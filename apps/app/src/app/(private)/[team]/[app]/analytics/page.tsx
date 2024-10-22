import { Metadata } from 'next'

import { DatePicker } from './date-picker'
import { Metrics } from './metrics'
import { Table } from './table'

export const metadata: Metadata = {
  title: 'Analytics | Advents',
}

export default async function Analytics(props: { params: Promise<{ app: string; team: string }> }) {
  const params = await props.params

  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Analytics</h1>

        <DatePicker />
      </div>

      <Metrics appSlug={params.app} teamSlug={params.team} />

      <Table className='mt-10' appSlug={params.app} teamSlug={params.team} />
    </div>
  )
}
