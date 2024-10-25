import React, { HTMLAttributes } from 'react'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'

export const EmptyScreen = ({ children }: { children?: React.ReactNode }) => {
  return <div className='mx-auto flex h-72 max-w-72 flex-col justify-center gap-4'>{children}</div>
}

export const EmptyScreenIcon = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='mb-1 w-fit rounded-lg border bg-white p-4 shadow-md'>
      <div className='flex size-5 items-center justify-center'>{children}</div>
    </div>
  )
}

export const EmptyScreenTitle = ({ children }: { children: React.ReactNode }) => {
  return <span className='text-xl font-semibold'>{children}</span>
}

export const EmptyScreenDescription = ({ children }: { children: React.ReactNode }) => {
  return <span className='text-sm text-muted-foreground'>{children}</span>
}

export const EmptyScreenButton = ({ children, className }: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <>
      {typeof children === 'string' ? (
        <Button size='sm' className={cn('mt-2 w-fit', className)}>
          {children}
        </Button>
      ) : (
        <div className={cn('mt-2', className)}>{children}</div>
      )}
    </>
  )
}
