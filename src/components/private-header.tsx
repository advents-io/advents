'use client'

import { LogOut, Menu, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import AdventsBrand from 'public/advents-brand.svg'
import { useState } from 'react'

import { signOutAction } from '@/actions/auth/sign-out-action'
import { ContactDropdown } from '@/components/contact-dropdown'
import { HeaderItem } from '@/components/header-item'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Avatar, AvatarFallback } from '@/ui/avatar'
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { Label } from '@/ui/label'
import { Separator } from '@/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/ui/sheet'
import { routes } from '@/utils/routes'

interface Props {
  email?: string
}

export const PrivateHeader = ({ email }: Props) => {
  const { execute: signOut, isExecuting } = useAction(signOutAction)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { app, team } = useParams<{ team: string; app: string }>()
  const includeTabs = !!team && !!app

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className='sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-1 md:flex'>
        <div className='flex flex-1 flex-row items-center gap-6'>
          <Link href={routes.TEAMS.path}>
            <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
          </Link>

          {includeTabs && (
            <>
              <HeaderItem href={routes.LINKS.path(team, app)}>Links</HeaderItem>
              <HeaderItem href={routes.ANALYTICS.path(team, app)}>Analytics</HeaderItem>
              <HeaderItem href={routes.SETTINGS.path(team, app)}>Ajustes</HeaderItem>
            </>
          )}
        </div>

        <div className='flex items-center gap-4'>
          <ContactDropdown>
            <Button variant='ghost' size='sm'>
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
      </nav>

      <div className='flex flex-1 items-center md:hidden'>
        <Link href={routes.TEAMS.path} className='flex flex-1'>
          <Image src={AdventsBrand} alt='Logo da Advents' className='w-20' />
        </Link>

        <ContactDropdown>
          <Button variant='ghost' size='sm'>
            Ajuda
          </Button>
        </ContactDropdown>

        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon'>
              <Menu className='size-4' />
            </Button>
          </SheetTrigger>

          <SheetContent side='right'>
            <nav className='grid gap-6'>
              <Link href={routes.TEAMS.path} onClick={closeMenu} className='mb-6'>
                <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
              </Link>

              {includeTabs && (
                <>
                  <HeaderItem onClick={closeMenu} href={routes.LINKS.path(team, app)}>
                    Links
                  </HeaderItem>
                  <HeaderItem onClick={closeMenu} href={routes.ANALYTICS.path(team, app)}>
                    Analytics
                  </HeaderItem>
                  <HeaderItem onClick={closeMenu} href={routes.SETTINGS.path(team, app)}>
                    Ajustes
                  </HeaderItem>
                </>
              )}

              <Separator />

              <div className='flex items-center gap-2 text-muted-foreground'>
                <User className='size-5' />
                <Label className='text-base font-normal'>{email}</Label>
              </div>

              <HeaderItem onClick={() => signOut()} className='text-base'>
                <LoadingSpinner loading={isExecuting} className='justify-start'>
                  <LogOut className='mr-2 size-4' />
                  Sair
                </LoadingSpinner>
              </HeaderItem>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
