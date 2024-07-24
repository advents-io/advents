'use client'

import { Menu, Package2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import AdventsLogo from 'public/advents.svg'
import { useState } from 'react'

import { NavigationItem } from '@/components/navigation-item'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Routes } from '@/utils/routes'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-row items-center gap-6 md:flex'>
        <Link href={Routes['/']}>
          <Image src={AdventsLogo} alt='Logo da Advents' className='mr-5 w-24' />
        </Link>

        <NavigationItem href={Routes['/']}>Links</NavigationItem>
        <NavigationItem href={Routes['/settings']}>Settings</NavigationItem>
      </nav>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <div className='flex flex-1 items-center justify-between md:hidden'>
            <Link href={Routes['/']}>
              <Package2 className='h-6 w-6' />
            </Link>

            <Button variant='outline' size='icon'>
              <Menu className='h-5 w-5' />
            </Button>
          </div>
        </SheetTrigger>

        <SheetContent side='right'>
          <nav className='grid gap-6'>
            <Link href={Routes['/']} className='flex items-center gap-2 text-lg font-semibold'>
              <Package2 className='h-6 w-6' />
            </Link>

            <NavigationItem onClick={closeMenu} href={Routes['/']}>
              Links
            </NavigationItem>
            <NavigationItem onClick={closeMenu} href={Routes['/settings']}>
              Settings
            </NavigationItem>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
