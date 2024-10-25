'use client'

import { DOCS_URL, routes } from '@advents/common'
import { App } from '@advents/db'
import { signOutAction, useAction } from '@advents/mutations'
import { LogOut, MoveUpRight, Slash, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import AdventsLogo from '@/assets/advents/logo.svg'
import { ContactDropdown } from '@/components/contact-dropdown'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Avatar, AvatarFallback } from '@/ui/avatar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/ui/breadcrumb'
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

import { AppSelector } from './app-selector'
import { HeaderItem } from './header-item'

interface Props {
  email?: string
  apps: Pick<App, 'id' | 'name' | 'slug' | 'imageUrl'>[]
}

export const PrivateHeader = ({ email, apps }: Props) => {
  const { execute: signOut, isExecuting } = useAction(signOutAction)
  const { app, team } = useParams<{ team: string; app: string }>()

  const includeTabs = !!team && !!app

  return (
    <header className='sticky -top-18 z-10 w-full border-b bg-background px-4 md:px-8'>
      <div className='flex py-4'>
        <div className='flex flex-1 flex-row items-center'>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className='hidden md:flex'>
                <BreadcrumbLink href={routes.TEAMS.path}>
                  <Image src={AdventsLogo} alt='Logo da Advents' className='w-6' />
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator className='hidden md:flex'>
                <Slash className='text-gray-300' />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <AppSelector apps={apps} />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className='flex items-center gap-1'>
          <ContactDropdown>
            <Button variant='ghost' size='sm' className='font-normal text-muted-foreground'>
              Ajuda
            </Button>
          </ContactDropdown>

          <Link href={DOCS_URL} target='_blank' className='hidden md:flex'>
            <Button variant='ghost' size='sm' className='font-normal text-muted-foreground'>
              Documentação
              <MoveUpRight className='ml-1 size-4' />
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className='cursor-pointer' asChild>
              <Avatar className='size-8'>
                <AvatarFallback>
                  <User className='size-4' />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
              <DropdownMenuLabel className='flex items-center gap-2 font-normal text-muted-foreground'>
                <User className='size-4' />
                {email}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled={isExecuting}
                onClick={() => signOut()}
                onSelect={e => e.preventDefault()}
              >
                <LoadingSpinner loading={isExecuting} className='justify-start'>
                  <LogOut className='mr-2 size-4' />
                  Sair
                </LoadingSpinner>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {includeTabs && (
        <nav className='flex gap-4'>
          <HeaderItem href={[routes.LINKS.path(team, app)]}>Links</HeaderItem>
          <HeaderItem href={[routes.ANALYTICS.path(team, app)]}>Analytics</HeaderItem>
          <HeaderItem href={[routes.SETTINGS.path(team, app), routes.SETTINGS_SDK.path(team, app)]}>
            Ajustes
          </HeaderItem>
        </nav>
      )}
    </header>
  )
}
