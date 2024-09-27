'use client'

import { routes } from '@advents/common'
import { App } from '@advents/db'
import { LogOut, Slash, User } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'

import { signOutAction } from '@/actions/auth/sign-out-action'
import AdventsLogo from '@/assets/advents/logo.svg'
import { AppSelector } from '@/components/app-selector'
import { ContactDropdown } from '@/components/contact-dropdown'
import { HeaderItem } from '@/components/header-item'
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

interface Props {
  email?: string
  apps: Pick<App, 'id' | 'name' | 'slug' | 'imageUrl'>[]
}

export const PrivateHeader = ({ email, apps }: Props) => {
  const { execute: signOut, isExecuting } = useAction(signOutAction)
  const { app, team } = useParams<{ team: string; app: string }>()

  const includeTabs = !!team && !!app

  return (
    <header className='sticky -top-18 z-10 w-full border-b bg-background px-4 md:px-14'>
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

        <div className='flex items-center gap-4'>
          <ContactDropdown>
            <Button variant='ghost' size='sm' className='font-normal text-muted-foreground'>
              Ajuda
            </Button>
          </ContactDropdown>

          <DropdownMenu>
            <DropdownMenuTrigger className='cursor-pointer' asChild>
              <Avatar className='size-8'>
                <AvatarFallback>
                  <User className='size-4' />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
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
        <nav className='flex gap-4 pt-2'>
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
