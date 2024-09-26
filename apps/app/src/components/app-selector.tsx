import { App } from '@advents/db'
import { CirclePlus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Button } from '@/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
import { routes } from '@advents/common'

interface Props {
  apps: Pick<App, 'id' | 'name' | 'slug' | 'imageUrl'>[]
}

export const AppSelector = ({ apps }: Props) => {
  const { app, team } = useParams<{ team: string; app?: string }>()
  const [open, setOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<string>(app || '')

  useEffect(() => {
    setSelectedApp(app || '')
  }, [app])

  const router = useRouter()

  const handleAppChange = (appSlug: string) => {
    if (appSlug === 'new-app') {
      router.push(routes.APPS_NEW.path(team))
      return
    }

    setSelectedApp(appSlug)
    router.push(routes.LINKS.path(team, appSlug))
  }

  const handleSeeAllApps = () => {
    setOpen(false)
    setSelectedApp('')
  }

  return (
    <Select value={selectedApp} onValueChange={handleAppChange} open={open} onOpenChange={setOpen}>
      <SelectTrigger className='w-40 font-medium text-foreground focus:ring-0 focus:ring-offset-0 md:w-72'>
        <SelectValue placeholder='Selecione um app' className='text-nowrap bg-red-400' />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel className='flex items-center gap-10'>
            <span className='w-full'>Meus apps</span>

            <Link href={routes.APPS.path(team)} onClick={handleSeeAllApps}>
              <Button size='sm' variant='outline'>
                Ver todos
              </Button>
            </Link>
          </SelectLabel>

          <SelectSeparator />

          {apps.map(app => (
            <SelectItem key={app.id} value={app.slug}>
              <div className='flex items-center gap-2'>
                <Image
                  src={app.imageUrl}
                  alt={app.name}
                  width={25}
                  height={25}
                  className='rounded-full'
                />
                <span className='truncate'>{app.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>

        <SelectItem value='new-app'>
          <div className='flex items-center gap-2'>
            <CirclePlus size={25} strokeWidth={1.5} />
            <span className='truncate'>Criar app</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
