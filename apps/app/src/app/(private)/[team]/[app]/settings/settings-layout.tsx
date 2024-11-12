'use client'

import { routes } from '@advents/common'
import { CodeIcon, GlobeIcon, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'

interface Props {
  team: string
  app: string
  children: React.ReactNode
}

export const SettingsLayout = ({ team, app, children }: Props) => {
  const pathname = usePathname()
  const router = useRouter()

  const SIDEBAR_ITEMS = [
    {
      icon: SettingsIcon,
      title: 'Geral',
      href: routes.SETTINGS.path(team, app),
    },
    {
      icon: GlobeIcon,
      title: 'Domínios',
      href: routes.SETTINGS_DOMAINS.path(team, app),
    },
    {
      icon: CodeIcon,
      title: 'SDK',
      href: routes.SETTINGS_SDK.path(team, app),
    },
  ]

  return (
    <div className='flex flex-col gap-6 sm:flex-row'>
      <div className='sm:hidden'>
        <Select value={pathname} onValueChange={value => router.push(value)}>
          <SelectTrigger className='w-full focus:ring-0 focus:ring-offset-0'>
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel className='text-xs font-semibold text-muted-foreground'>
                Ajustes do app
              </SelectLabel>

              {SIDEBAR_ITEMS.map((item, index) => (
                <SelectItem key={index} value={item.href}>
                  <div className='flex items-center'>
                    <item.icon className='mr-2 size-4 text-muted-foreground' />
                    {item.title}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <aside className='hidden w-64 sm:block'>
        <h2 className='mb-3 text-xs font-medium text-muted-foreground'>Ajustes do app</h2>

        <div className='flex flex-col gap-1'>
          {SIDEBAR_ITEMS.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                variant='ghost'
                className={cn(
                  'w-full justify-start font-normal hover:bg-gray-200',
                  pathname === item.href && 'bg-gray-200',
                )}
                size='sm'
              >
                <item.icon className='mr-2 size-4 text-muted-foreground' />
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </aside>

      <main className='w-full'>{children}</main>
    </div>
  )
}
