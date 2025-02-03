import { routes } from '@advents/common'
import { CirclePlusIcon } from 'lucide-react'
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

interface Props {
  teams: {
    slug: string
    name: string
    apps: {
      id: string
      name: string
      slug: string
      imageUrl: string
    }[]
  }[]
}

export const AppSelector = ({ teams }: Props) => {
  const { app: initialApp, team: initialTeam } = useParams<{ app?: string; team?: string }>()
  const [open, setOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<string>(
    initialTeam && initialApp ? `${initialTeam}/${initialApp}` : '',
  )

  useEffect(() => {
    setSelectedApp(initialTeam && initialApp ? `${initialTeam}/${initialApp}` : '')
  }, [initialApp, initialTeam])

  const router = useRouter()

  const handleAppChange = (value: string) => {
    const [teamSlug, appSlug] = value.split('/')

    if (appSlug === 'new-app') {
      router.push(routes.APPS_NEW.path(teamSlug))
      return
    }

    setSelectedApp(appSlug)
    router.push(routes.LINKS.path(teamSlug, appSlug))
  }

  const handleSeeAllApps = () => {
    setOpen(false)
    setSelectedApp('')
  }

  return (
    <Select
      value={selectedApp}
      onValueChange={handleAppChange}
      open={open}
      onOpenChange={setOpen}
      disabled={!initialTeam}
    >
      <SelectTrigger className='w-52 font-medium text-foreground focus:ring-0 focus:ring-offset-0 md:w-64'>
        <SelectValue placeholder='Selecione um app' className='text-nowrap' />
      </SelectTrigger>

      <SelectContent>
        {teams.map(team => (
          <SelectGroup key={team.slug}>
            <SelectLabel className='flex items-center gap-2'>
              <span className='w-full'>Equipe {team.name}</span>

              <Link href={routes.APPS.path(team.slug)} onClick={handleSeeAllApps}>
                <Button size='sm' variant='outline'>
                  Ver todos
                </Button>
              </Link>
            </SelectLabel>

            {team.apps.map(app => (
              <SelectItem
                key={app.id}
                value={`${team.slug}/${app.slug}`}
                className='cursor-pointer'
              >
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

            <SelectItem value={`${team.slug}/new-app`} className='cursor-pointer'>
              <div className='flex items-center gap-2'>
                <CirclePlusIcon size={25} strokeWidth={1.5} />
                <span className='truncate'>Criar app</span>
              </div>
            </SelectItem>

            {teams.indexOf(team) < teams.length - 1 && <SelectSeparator />}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}
