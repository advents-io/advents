'use client'

import { getAppAnalyticsAction, useAction } from '@advents/actions'
import { dayjs } from '@advents/common'
import { DollarSign, Download, MousePointerClick, RedoDot } from 'lucide-react'
import { HTMLAttributes, useEffect } from 'react'

import { cn } from '@/lib/tailwind'

import { MetricCard } from './metric-card'
import { useStartEndDate } from './use-start-end-date'

interface Props extends HTMLAttributes<HTMLDivElement> {
  appSlug: string
}

export const Metrics = ({ appSlug, className }: Props) => {
  const [{ startDate, endDate }] = useStartEndDate()

  const {
    execute: getAppAnalytics,
    isExecuting,
    isIdle,
    result: { data },
  } = useAction(getAppAnalyticsAction)

  useEffect(() => {
    getAppAnalytics({
      appSlug,
      startDate: dayjs(startDate).toDate(),
      endDate: dayjs(endDate).toDate(),
    })
  }, [appSlug, startDate, endDate, getAppAnalytics])

  const clicks = data ? data.clicks.toLocaleString('en-US').replace(',', '.') : undefined
  const installs = data ? data.installs.toLocaleString('en-US').replace(',', '.') : undefined
  const cti = data ? `${roundNumber(data.cti)}%` : undefined
  const revenue = data ? `R$ ${data.revenue.toFixed(2).replace('.', ',')}` : undefined

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4', className)}>
      <MetricCard
        title='Cliques'
        value={clicks}
        increase={data?.clicksIncrease}
        icon={<MousePointerClick className='size-4 text-muted-foreground' />}
        loading={isExecuting || isIdle}
      />

      <MetricCard
        title='Instalações'
        value={installs}
        increase={data?.installsIncrease}
        icon={<Download className='size-4 text-muted-foreground' />}
        loading={isExecuting || isIdle}
      />

      <MetricCard
        title='Cliques para Instalações'
        value={cti}
        increase={data?.ctiIncrease}
        icon={<RedoDot className='size-4 text-muted-foreground' />}
        loading={isExecuting || isIdle}
        tooltip='Taxa de conversão de cliques para instalações.'
      />

      <MetricCard
        title='Receita'
        value={revenue}
        increase={data?.revenueIncrease}
        icon={<DollarSign className='size-4 text-muted-foreground' />}
        loading={isExecuting || isIdle}
      />
    </div>
  )
}

const roundNumber = (value: number) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(2).replace('.', ',')
