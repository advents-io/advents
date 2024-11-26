import * as React from 'react'

import { cn } from '@/lib/tailwind'

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

interface SlugInputProps extends React.ComponentProps<'input'> {
  prefix: string
}

const SlugInput = React.forwardRef<HTMLInputElement, SlugInputProps>(
  ({ className, type, prefix, ...props }, ref) => {
    return (
      <div className='flex h-10 rounded-md border border-input bg-background text-sm'>
        <div className='hidden items-center overflow-hidden rounded-s-md border-r bg-gray-50 px-3 sm:flex'>
          <span className='text-muted-foreground'>{prefix}</span>
        </div>

        <input
          type={type}
          className={cn(
            'flex flex-1 rounded-md px-3 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  },
)
SlugInput.displayName = 'SlugInput'

export { Input, SlugInput }
