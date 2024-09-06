'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/tailwind'

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
)

// shadcn-ui change: adiciona optional ao label
interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  optional?: boolean
}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, optional = false, ...props }, ref) => (
    <div>
      <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
      {optional && <span className='ml-1 text-xs text-muted-foreground'> (opcional)</span>}
    </div>
  ),
)
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
