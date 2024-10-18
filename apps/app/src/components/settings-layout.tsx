'use client'

import { routes } from '@advents/common'
import { SelectGroup } from '@radix-ui/react-select'
import { Code, SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import {
  Select,
  SelectContent,
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
      icon: Code,
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
              <SelectLabel className='text-sm font-normal text-muted-foreground'>
                Ajustes do app
              </SelectLabel>

              {SIDEBAR_ITEMS.map((item, index) => (
                <SelectItem key={index} value={item.href}>
                  <div className='flex items-center'>
                    <item.icon className='mr-2 size-4' />
                    {item.title}
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <aside className='hidden w-64 sm:block'>
        <h2 className='mb-3 text-sm text-muted-foreground'>Ajustes do app</h2>

        <div className='flex flex-col gap-1'>
          {SIDEBAR_ITEMS.map((item, index) => (
            <Link key={index} href={item.href}>
              <Button
                variant='ghost'
                className={cn(
                  'w-full justify-start font-normal',
                  pathname === item.href && 'bg-gray-100',
                )}
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
