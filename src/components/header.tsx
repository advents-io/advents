'use client'

import { Menu } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import AdventsBrand from 'public/advents.svg'
import { useState } from 'react'

import { NavigationItem } from '@/components/navigation-item'
import { Button } from '@/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/ui/sheet'
import { routes } from '@/utils/routes'

const TABS = [
  { label: 'Links', href: routes.links },
  { label: 'Analytics', href: routes.analytics },
  { label: 'Ajustes', href: routes.settings },
]

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-row items-center gap-6 md:flex'>
        <Link href={routes.links}>
          <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
        </Link>

        {TABS.map((tab, index) => (
          <NavigationItem key={index} href={tab.href}>
            {tab.label}
          </NavigationItem>
        ))}
      </nav>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <div className='flex flex-1 items-center justify-between md:hidden'>
            <Link href={routes.links}>
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
              href={routes.links}
              onClick={closeMenu}
              className='flex items-center gap-2 text-lg font-semibold'
            >
              <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
            </Link>

            {TABS.map((tab, index) => (
              <NavigationItem key={index} onClick={closeMenu} href={tab.href}>
                {tab.label}
              </NavigationItem>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  )
}
