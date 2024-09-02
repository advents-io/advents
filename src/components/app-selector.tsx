import { App } from '@prisma/client'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

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
import { routes } from '@/utils/routes'

interface Props {
  apps: Pick<App, 'id' | 'name' | 'slug'>[]
}

export const AppSelector = ({ apps }: Props) => {
  const { app, team } = useParams<{ team: string; app: string }>()
  const [open, setOpen] = useState(false)

  const router = useRouter()

  const handleAppChange = (appSlug: string) => {
    router.push(routes.LINKS.path(team, appSlug))
  }

  return (
    <Select defaultValue={app} onValueChange={handleAppChange} open={open} onOpenChange={setOpen}>
      <SelectTrigger className='w-56 font-medium text-foreground focus:ring-0 focus:ring-offset-0'>
        <SelectValue placeholder='Selecione um app' />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel className='flex items-center gap-10'>
            <span className='w-full'>Meus apps</span>

            <Link href={routes.APPS.path(team)} onClick={() => setOpen(false)}>
              <Button size='sm' variant='outline'>
                Ver todos
              </Button>
            </Link>
          </SelectLabel>

          <SelectSeparator />

          {apps.map(app => (
            <SelectItem key={app.id} value={app.slug}>
              {app.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
