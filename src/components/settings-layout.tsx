'use client'

import { Code, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/ui/button'
import { routes } from '@/utils/routes'

interface Props {
  team: string
  app: string
  children: React.ReactNode
}

export const SettingsLayout = ({ team, app, children }: Props) => {
  const pathname = usePathname()

  const SIDEBAR_ITEMS = [
    {
      icon: SettingsIcon,
      title: 'Geral',
      href: routes.SETTINGS.path(team, app),
    },
    {
      icon: Code,
      title: 'SDK',
      href: routes.SETTINGS_SDK.path(team, app),
    },
  ]

  return (
    <div className='flex gap-6'>
      <aside className='hidden w-64 flex-col sm:flex'>
        <h2 className='mb-3 text-sm text-muted-foreground'>Ajustes do app</h2>

        <div className='flex flex-col gap-1'>
          {SIDEBAR_ITEMS.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                data-isactive={pathname === item.href}
                variant='ghost'
                className='w-full justify-start font-normal data-[isactive=true]:bg-gray-100'
                size='sm'
              >
                <item.icon className='mr-2 size-4' />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </aside>

      <main className='max-w-lg flex-1'>{children}</main>
    </div>
  )
}
