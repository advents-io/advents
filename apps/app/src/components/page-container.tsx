import { Separator } from '@radix-ui/react-dropdown-menu'
import React, { HtmlHTMLAttributes } from 'react'

interface Props extends HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  title: string
  actions?: React.ReactNode
}

export const PageContainer = ({ children, title, actions, className }: Props) => {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='mb-6 flex h-14 items-center justify-between'>
        <h1 className='text-3xl font-medium'>{title}</h1>

        {actions}
      </div>

      <Separator className='-mx-[9999px] my-4 h-[1px] bg-gray-200' />

      <div className={className}>{children}</div>
    </div>
  )
}
