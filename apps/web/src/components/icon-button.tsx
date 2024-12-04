import { HTMLAttributes } from 'react'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props extends HTMLAttributes<HTMLButtonElement> {
  tooltip?: React.ReactNode
}

export const IconButton = ({ className, children, tooltip, ...props }: Props) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn('size-8 text-muted-foreground', className)}
          variant='ghost'
          size='icon'
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>

      {tooltip && <TooltipContent>{tooltip}</TooltipContent>}
    </Tooltip>
  )
}
