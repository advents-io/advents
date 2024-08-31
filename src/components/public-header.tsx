import Image from 'next/image'
import Link from 'next/link'
import AdventsBrand from 'public/advents-brand.svg'

import { ContactDropdown } from '@/components/contact-dropdown'
import { Button } from '@/ui/button'
import { WEBSITE_URL } from '@/utils/constants'

export const PublicHeader = () => {
  return (
    <header className='absolute flex h-14 w-full px-4 md:px-6'>
      <nav className='flex flex-1 items-center'>
        <Link href={WEBSITE_URL} target='_blank' className='flex flex-1'>
          <Image src={AdventsBrand} alt='Logo da Advents' className='mr-5 w-24' />
        </Link>

        <ContactDropdown>
          <Button variant='ghost' size='sm'>
            Contato
          </Button>
        </ContactDropdown>
      </nav>
    </header>
  )
}
