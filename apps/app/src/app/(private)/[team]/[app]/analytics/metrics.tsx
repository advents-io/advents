'use client'

import { useQuery } from '@tanstack/react-query'
import { DollarSignIcon, DownloadIcon, MousePointerClickIcon, RedoDotIcon } from 'lucide-react'
import { HTMLAttributes } from 'react'

import { getAppAnalytics } from '@/lib/queries/get-app-analytics'
import { cn } from '@/lib/tailwind'

import { MetricCard } from './metric-card'
import { useStartEndDate } from './use-start-end-date'

interface Props extends HTMLAttributes<HTMLDivElement> {
  appSlug: string
  teamSlug: string
}

export const Metrics = ({ appSlug, teamSlug, className }: Props) => {
  const [{ startDate, endDate }] = useStartEndDate()

  const { data, isPending } = useQuery({
    queryKey: ['app-analytics', appSlug, teamSlug, startDate, endDate],
    queryFn: () => getAppAnalytics(appSlug, teamSlug, startDate, endDate),
  })

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
        icon={<MousePointerClickIcon className='size-4 text-muted-foreground' />}
        loading={isPending}
      />

      <MetricCard
        title='Instalações'
        value={installs}
        increase={data?.installsIncrease}
        icon={<DownloadIcon className='size-4 text-muted-foreground' />}
        loading={isPending}
      />

      <MetricCard
        title='Cliques para Instalações'
        value={cti}
        increase={data?.ctiIncrease}
        icon={<RedoDotIcon className='size-4 text-muted-foreground' />}
        loading={isPending}
        tooltip='Taxa de conversão de cliques para instalações.'
      />

      <MetricCard
        title='Receita'
        value={revenue}
        increase={data?.revenueIncrease}
        icon={<DollarSignIcon className='size-4 text-muted-foreground' />}
        loading={isPending}
      />
    </div>
  )
}

const roundNumber = (value: number) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(2).replace('.', ',')
