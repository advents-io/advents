'use client'

import { dayjs } from '@advents/common'
import { useQuery } from '@tanstack/react-query'
import { DollarSignIcon, DownloadIcon, MousePointerClickIcon, RedoDotIcon } from 'lucide-react'
import { HTMLAttributes } from 'react'

import { getAppAnalytics } from '@/lib/queries/get-app-analytics'
import { cn } from '@/lib/tailwind'

import { MetricCard } from './metric-card'
import { useStartEndDate } from './use-start-end-date'

interface Props extends HTMLAttributes<HTMLDivElement> {
  teamSlug: string
  appSlug: string
}

export const Metrics = ({ teamSlug, appSlug, className }: Props) => {
  const [{ startDate, endDate }] = useStartEndDate()

  const { data, isPending } = useQuery({
    queryKey: ['app-analytics', teamSlug, appSlug, startDate, endDate],
    queryFn: () =>
      getAppAnalytics({
        teamSlug,
        appSlug,
        startDate: dayjs(startDate).toDate(),
        endDate: dayjs(endDate).toDate(),
      }),
  })

  const clicks = data ? data.clicks.toLocaleString('en-US').replace(',', '.') : undefined
  const installs = data ? data.installs.toLocaleString('en-US').replace(',', '.') : undefined
  const cti = data ? `${roundNumber(data.cti)}%` : undefined
  const revenue = data
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(data.revenue)
    : undefined

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4', className)}>
      <MetricCard
        title='Cliques'
        value={clicks}
        increase={data?.clicksIncrease}
        icon={<MousePointerClickIcon className='size-4 text-muted-foreground' />}
        loading={isPending}
        lastPeriodStartDate={data?.lastPeriodStartDate}
        lastPeriodEndDate={data?.lastPeriodEndDate}
      />

      <MetricCard
        title='Instalações'
        value={installs}
        increase={data?.installsIncrease}
        icon={<DownloadIcon className='size-4 text-muted-foreground' />}
        loading={isPending}
        lastPeriodStartDate={data?.lastPeriodStartDate}
        lastPeriodEndDate={data?.lastPeriodEndDate}
      />

      <MetricCard
        title='Cliques para Instalações'
        value={cti}
        increase={data?.ctiIncrease}
        icon={<RedoDotIcon className='size-4 text-muted-foreground' />}
        loading={isPending}
        tooltip='Taxa de conversão de cliques para instalações.'
        lastPeriodStartDate={data?.lastPeriodStartDate}
        lastPeriodEndDate={data?.lastPeriodEndDate}
      />

      <MetricCard
        title='Receita'
        value={revenue}
        increase={data?.revenueIncrease}
        icon={<DollarSignIcon className='size-4 text-muted-foreground' />}
        loading={isPending}
        lastPeriodStartDate={data?.lastPeriodStartDate}
        lastPeriodEndDate={data?.lastPeriodEndDate}
      />
    </div>
  )
}

const roundNumber = (value: number) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(2).replace('.', ',')
