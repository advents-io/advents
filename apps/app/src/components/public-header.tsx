import Image from 'next/image'

import AdventsBrand from '@/assets/advents/brand.svg'
import { ContactDropdown } from '@/components/contact-dropdown'
import { Button } from '@/ui/button'

export const PublicHeader = () => {
  return (
    <header className='absolute flex h-14 w-full px-4 md:px-14'>
      <nav className='flex flex-1 items-center justify-between gap-5'>
        <Image src={AdventsBrand} alt='Logo da Advents' className='w-24' />

        <ContactDropdown align='end'>
          <Button variant='ghost' size='sm'>
            Contato
          </Button>
        </ContactDropdown>
      </nav>
    </header>
  )
}
