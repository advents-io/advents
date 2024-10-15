import { Metadata } from 'next'

import { AnalyticsTable } from './analytics-table'
import { DatePicker } from './date-picker'
import { Metrics } from './metrics'

export const metadata: Metadata = {
  title: 'Analytics | Advents',
}

export default async function Analytics({ params }: { params: { app: string } }) {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      <div className='flex items-start justify-between'>
        <h1 className='text-xl font-bold'>Analytics</h1>

        <DatePicker />
      </div>

      <Metrics appSlug={params.app} />

      <AnalyticsTable className='mt-6' appSlug={params.app} />
    </div>
  )
}
