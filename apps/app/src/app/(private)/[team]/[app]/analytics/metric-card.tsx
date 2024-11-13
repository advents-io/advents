import { dayjs } from '@advents/common'
import { ArrowDownIcon, ArrowUpIcon, HelpCircleIcon } from 'lucide-react'

import { cn } from '@/lib/tailwind'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Skeleton } from '@/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props {
  title: string
  value?: string
  increase?: number
  icon: React.ReactNode
  tooltip?: string
  loading?: boolean
  lastPeriodStartDate?: Date
  lastPeriodEndDate?: Date
}

export const MetricCard = ({
  title,
  value,
  increase,
  icon,
  tooltip,
  loading = false,
  lastPeriodStartDate,
  lastPeriodEndDate,
}: Props) => {
  const formatedValue = value || '-'

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 pb-2'>
        <CardTitle className='flex items-center gap-2 truncate text-sm font-medium'>
          <span className='truncate'>{title}</span>

          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircleIcon className='size-3.5 text-muted-foreground' />
              </TooltipTrigger>

              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
        {icon}
      </CardHeader>

      <CardContent className='space-y-1'>
        {!loading ? (
          <>
            <p className='truncate text-2xl font-bold'>{formatedValue}</p>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className='w-fit'>
                  <IncreaseValue increase={increase} />
                </div>
              </TooltipTrigger>

              <TooltipContent className='max-w-xs'>
                <IncreaseValue increase={increase} /> em relação ao período anterior de{' '}
                <b>{dayjs(lastPeriodStartDate).format('DD/MM/YYYY')}</b> à{' '}
                <b>{dayjs(lastPeriodEndDate).format('DD/MM/YYYY')}</b>.
              </TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <Skeleton className='h-[32px] w-full' />
            <Skeleton className='mt-1 h-[24px] w-1/2' />
          </>
        )}
      </CardContent>
    </Card>
  )
}

interface IncreaseValueProps {
  increase?: number
}

const IncreaseValue = ({ increase }: IncreaseValueProps) => {
  const formatedIncrease = increase
    ? Number.isInteger(increase)
      ? increase.toString()
      : increase.toFixed(1).replace('.', ',')
    : '0'

  const increaseIsPositive = !!increase && increase > 0
  const increaseIsNegative = !!increase && increase < 0

  return (
    <p
      className={cn(
        'inline-flex items-center gap-1 whitespace-pre text-sm font-bold',
        increaseIsPositive && 'text-green-600',
        increaseIsNegative && 'text-red-500',
      )}
    >
      {increaseIsPositive && <ArrowUpIcon className='size-3' strokeWidth={2.5} />}
      {increaseIsNegative && <ArrowDownIcon className='size-3' strokeWidth={2.5} />}
      {formatedIncrease}%
    </p>
  )
}
