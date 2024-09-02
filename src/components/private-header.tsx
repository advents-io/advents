'use client'

import { LogOut, Slash, User } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import AdventsLogo from 'public/advents-logo.svg'

import { signOutAction } from '@/actions/auth/sign-out-action'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select'
import { routes } from '@/utils/routes'

interface Props {
  email?: string
}

export const PrivateHeader = ({ email }: Props) => {
  const { execute: signOut, isExecuting } = useAction(signOutAction)
  const { app, team } = useParams<{ team: string; app: string }>()

  const includeTabs = !!team && !!app

  return (
    <>
      <header className='sticky top-0 z-10 hidden border-b bg-background md:flex'>
        <div className='mx-14 w-full space-y-4 pt-4'>
          <div className='flex'>
            <div className='flex flex-1 flex-row items-center'>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={routes.TEAMS.path}>
                      <Image src={AdventsLogo} alt='Logo da Advents' className='w-6' />
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  <BreadcrumbSeparator>
                    <Slash className='text-gray-300' />
                  </BreadcrumbSeparator>

                  <BreadcrumbItem>
                    <Select>
                      <SelectTrigger className='w-56'>
                        <SelectValue placeholder='Theme' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='light'>Light</SelectItem>
                        <SelectItem value='dark'>Dark</SelectItem>
                        <SelectItem value='system'>System</SelectItem>
                      </SelectContent>
                    </Select>
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
            <nav className='flex gap-6'>
              <HeaderItem href={routes.LINKS.path(team, app)}>Links</HeaderItem>
              <HeaderItem href={routes.ANALYTICS.path(team, app)}>Analytics</HeaderItem>
              <HeaderItem href={routes.SETTINGS.path(team, app)}>Ajustes</HeaderItem>
            </nav>
          )}
        </div>
      </header>

      <header className='sticky top-0 z-10 flex flex-col gap-4 border-b bg-background p-3 pb-0 md:hidden'>
        <div className='flex flex-1 items-center gap-2'>
          <div className='flex flex-1'>
            <Select>
              <SelectTrigger className='w-52'>
                <SelectValue placeholder='Theme' />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value='light'>Light</SelectItem>
                <SelectItem value='dark'>Dark</SelectItem>
                <SelectItem value='system'>System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ContactDropdown>
            <Button variant='ghost' className='font-normal text-muted-foreground' size='sm'>
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

        {includeTabs && (
          <nav className='flex gap-6'>
            <HeaderItem href={routes.LINKS.path(team, app)}>Links</HeaderItem>
            <HeaderItem href={routes.ANALYTICS.path(team, app)}>Analytics</HeaderItem>
            <HeaderItem href={routes.SETTINGS.path(team, app)}>Ajustes</HeaderItem>
          </nav>
        )}
      </header>
    </>
  )
}
