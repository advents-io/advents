import { ArrowDown, ArrowUp, Info, Loader2 } from 'lucide-react'
import { HTMLAttributes } from 'react'

import { cn } from '@/lib/tailwind'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
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
                <Info className='size-3' />
              </TooltipTrigger>

              <TooltipContent>{tooltip}</TooltipContent>
            </Tooltip>
          )}
        </CardTitle>
        {icon}
      </CardHeader>

      <CardContent className='relative'>
        <p className='text-2xl font-bold'>{formatedValue}</p>

        <div className='flex items-center gap-1'>
          {increaseIsPositive && <ArrowUp className='size-3 text-green-600' />}
          {increaseIsNegative && <ArrowDown className='size-3 text-red-500' />}

          <p className='text-xs text-muted-foreground'>
            <span
              data-ispositive={increaseIsPositive}
              data-isnegative={increaseIsNegative}
              className='font-bold data-[isnegative=true]:text-red-500 data-[ispositive=true]:text-green-600'
            >
              {formatedIncrease}%
            </span>{' '}
            em relação ao último período
          </p>
        </div>

        {loading && (
          <div className='absolute inset-x-0 bottom-1 top-0 bg-white pl-6 pt-1'>
            <Loader2 className='size-6 animate-spin' />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
