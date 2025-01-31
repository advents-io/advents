import { Separator } from '@radix-ui/react-dropdown-menu'
import React, { HtmlHTMLAttributes } from 'react'

import { cn } from '@/lib/tailwind'

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  title: string
  actions?: React.ReactNode
}

export const PageContainer = ({ children, title, actions, className }: Props) => {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='mb-8 flex h-14 items-center justify-between gap-2'>
        <h1 className='truncate text-2xl font-medium md:text-3xl'>{title}</h1>

        {actions}
      </div>

      <Separator className='-mx-[9999px] mb-10 h-[1px] bg-gray-200' />

      <div className={cn('mx-auto w-full', className)}>{children}</div>
    </div>
  )
}
