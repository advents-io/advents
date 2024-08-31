'use client'

import { LogOut, Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAction } from 'next-safe-action/hooks'
import AdventsBrand from 'public/advents-brand.svg'
import { useState } from 'react'

import { signOutAction } from '@/actions/auth/sign-out-action'
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
import { Sheet, SheetContent, SheetTrigger } from '@/ui/sheet'
import { routes } from '@/utils/routes'

const TABS = [
  { label: 'Links', href: routes.LINKS.path },
  { label: 'Analytics', href: routes.ANALYTICS.path },
  { label: 'Ajustes', href: routes.SETTINGS.path },
]

interface Props {
  email?: string
}

export const PrivateHeader = ({ email }: Props) => {
  const { execute: signOut, isExecuting } = useAction(signOutAction)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className='sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-1 md:flex'>
        <div className='flex flex-1 flex-row items-center gap-6'>
          <Link href={routes.LINKS.path}>
            <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
          </Link>

          {TABS.map((tab, index) => (
            <HeaderItem key={index} href={tab.href}>
              {tab.label}
            </HeaderItem>
          ))}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className='cursor-pointer' asChild>
            <Avatar className='size-8'>
              <AvatarFallback className='text-sm'>
                {email?.slice(0, 1).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>{email}</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isExecuting}
              onClick={() => signOut()}
              onSelect={e => e.preventDefault()}
            >
              <LoadingSpinner loading={isExecuting}>
                <LogOut className='mr-2 size-4' />
                Sair
              </LoadingSpinner>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <div className='flex flex-1 items-center justify-between md:hidden'>
            <Link href={routes.LINKS.path}>
              <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
            </Link>

            <Button variant='outline' size='icon'>
              <Menu className='size-4' />
            </Button>
          </div>
        </SheetTrigger>

        <SheetContent side='right'>
          <nav className='grid gap-6'>
            <Link href={routes.LINKS.path} onClick={closeMenu} className='mb-6'>
              <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
            </Link>

            {TABS.map((tab, index) => (
              <HeaderItem key={index} onClick={closeMenu} href={tab.href}>
                {tab.label}
              </HeaderItem>
            ))}

            <Label className='mt-10 text-base text-muted-foreground'>{email}</Label>

            <HeaderItem onClick={() => signOut()} className='text-base'>
              <LoadingSpinner loading={isExecuting}>
                <LogOut className='mr-2 size-4' />
                Sair
              </LoadingSpinner>
            </HeaderItem>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
