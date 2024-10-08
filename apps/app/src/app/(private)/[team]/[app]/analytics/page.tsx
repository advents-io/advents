import { Metadata } from 'next'

import { AnalyticsTable } from './analytics-table'

export const metadata: Metadata = {
  title: 'Analytics | Advents',
}

export default async function Analytics({ params }: { params: { app: string } }) {
  return (
    <div className='flex flex-1 flex-col'>
      <h1 className='mb-4 text-xl font-bold'>Analytics</h1>
      <AnalyticsTable appSlug={params.app} />
    </div>
  )
}
