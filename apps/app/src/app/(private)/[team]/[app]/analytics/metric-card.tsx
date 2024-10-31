import { ArrowDownIcon, ArrowUpIcon, HelpCircleIcon } from 'lucide-react'
import { HTMLAttributes } from 'react'

import { cn } from '@/lib/tailwind'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { Skeleton } from '@/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string
  value?: string
  increase?: number
  icon: React.ReactNode
  tooltip?: string
  loading?: boolean
}

export const MetricCard = ({
  title,
  value,
  increase,
  icon,
  tooltip,
  className,
  loading = false,
}: Props) => {
  const formatedValue = value || '-'

  const formatedIncrease = increase
    ? Number.isInteger(increase)
      ? increase.toString()
      : increase.toFixed(1).replace('.', ',')
    : '0'

  const increaseIsPositive = !!increase && increase > 0
  const increaseIsNegative = !!increase && increase < 0

  return (
    <Card className={cn(className)}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='flex items-center gap-2 text-sm font-medium'>
          {title}

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

      <CardContent>
        {!loading ? (
          <>
            <p className='text-2xl font-bold'>{formatedValue}</p>

            <div className='flex items-center gap-1'>
              {increaseIsPositive && (
                <ArrowUpIcon className='size-3 text-green-600' strokeWidth={2.5} />
              )}
              {increaseIsNegative && (
                <ArrowDownIcon className='size-3 text-red-500' strokeWidth={2.5} />
              )}

              <p className='text-xs text-muted-foreground'>
                <span
                  className={cn(
                    'font-bold',
                    increaseIsPositive && 'text-green-600',
                    increaseIsNegative && 'text-red-500',
                  )}
                >
                  {formatedIncrease}%
                </span>{' '}
                em relação ao último período
              </p>
            </div>
          </>
        ) : (
          <>
            <Skeleton className='h-[26px] w-[100px]' />
            <Skeleton className='mt-2 h-[14px] w-[240px]' />
          </>
        )}
      </CardContent>
    </Card>
  )
}
