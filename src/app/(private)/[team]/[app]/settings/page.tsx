import { Settings as SettingsIcon } from 'lucide-react'
import { Metadata } from 'next'
import React from 'react'

import { EditAppForm } from '@/components/edit-app-form'
import { Button } from '@/ui/button'

export const metadata: Metadata = {
  title: 'Ajustes | Advents',
}

const SIDEBAR_ITEMS = [
  {
    icon: SettingsIcon,
    title: 'Geral',
  },
]

export default async function Settings() {
  return (
    <div className='flex gap-6'>
      <aside className='hidden w-64 flex-col sm:flex'>
        <h2 className='mb-3 text-sm text-muted-foreground'>Ajustes do app</h2>

        <div className='space-y-1'>
          {SIDEBAR_ITEMS.map((item, index) => (
            <Button
              key={index}
              variant='ghost'
              className='w-full justify-start bg-gray-100 font-normal'
              size='sm'
            >
              <item.icon className='mr-2 size-4' />
              {item.title}
            </Button>
          ))}
        </div>
      </aside>

      <main className='max-w-lg flex-1'>
        <EditAppForm />
      </main>
    </div>
  )
}
