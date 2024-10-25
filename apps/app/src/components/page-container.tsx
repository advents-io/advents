import React, { HtmlHTMLAttributes } from 'react'

import { cn } from '@/lib/tailwind'

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  title: string
  actions?: React.ReactNode
}

export const PageContainer = ({ children, title, actions, className }: Props) => {
  return (
    <div className={cn('flex flex-1 flex-col', className)}>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>{title}</h1>

        {actions}
      </div>

      {children}
    </div>
  )
}
