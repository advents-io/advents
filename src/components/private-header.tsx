'use client'

import { LogOut, Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useAction } from 'next-safe-action/hooks'
import AdventsBrand from 'public/advents.svg'
import { useState } from 'react'

import { signOutAction } from '@/actions/auth/sign-out-action'
import { HeaderItem } from '@/components/header-item'
import { LoadingSpinner } from '@/components/loading-spinner'
import { Button } from '@/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/ui/sheet'
import { routes } from '@/utils/routes'

const TABS = [
  { label: 'Links', href: routes.LINKS.path },
  { label: 'Analytics', href: routes.ANALYTICS.path },
  { label: 'Ajustes', href: routes.SETTINGS.path },
]

export const PrivateHeader = () => {
  const { execute: signOut, isExecuting } = useAction(signOutAction)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className='sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
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

        <Button variant='ghost' onClick={() => signOut()} disabled={isExecuting}>
          <LoadingSpinner loading={isExecuting}>
            <LogOut className='mr-2 h-4 w-4' />
            Sair
          </LoadingSpinner>
        </Button>
      </nav>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <div className='flex flex-1 items-center justify-between md:hidden'>
            <Link href={routes.LINKS.path}>
              <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
            </Link>

            <Button variant='outline' size='icon'>
              <Menu className='h-5 w-5' />
            </Button>
          </div>
        </SheetTrigger>

        <SheetContent side='right'>
          <nav className='grid gap-6'>
            <Link
              href={routes.LINKS.path}
              onClick={closeMenu}
              className='flex items-center gap-2 text-lg font-semibold'
            >
              <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
            </Link>

            {TABS.map((tab, index) => (
              <HeaderItem key={index} onClick={closeMenu} href={tab.href}>
                {tab.label}
              </HeaderItem>
            ))}

            <HeaderItem onClick={() => signOut()}>
              <LoadingSpinner loading={isExecuting}>
                <LogOut className='mr-2 h-4 w-4' />
                Sair
              </LoadingSpinner>
            </HeaderItem>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
