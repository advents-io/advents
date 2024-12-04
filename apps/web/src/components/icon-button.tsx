import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: React.ReactNode
  isLoading?: boolean
}

export const IconButton = ({ className, children, tooltip, isLoading, ...props }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className='flex size-8 items-center justify-center'>
          {isLoading ? (
            <Loader2Icon className='size-4 animate-spin' />
          ) : (
            <Button
              className={cn('size-8 text-muted-foreground', className)}
              variant='ghost'
              size='icon'
              type='button'
              {...props}
            >
              {children}
            </Button>
          )}
        </div>
      </TooltipTrigger>

      {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
    </Tooltip>
  )
}
