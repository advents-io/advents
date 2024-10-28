'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import { CircleHelpIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/tailwind'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

// shadcn-ui change: add optional and tooltip to label
interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  optional?: boolean
  tooltip?: React.ReactNode
}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, optional = false, tooltip, ...props }, ref) => (
    <div className={cn('flex items-center py-1', className)}>
      <LabelPrimitive.Root ref={ref} className={cn(labelVariants())} {...props} />
      {optional && (
        <span className='ml-1 text-xs leading-none text-muted-foreground'>(opcional)</span>
      )}
      {tooltip && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleHelpIcon className='ml-1.5 size-3.5 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  ),
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
