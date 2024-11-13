import { DOCS_URL } from '@advents/common'
import { MoveUpRightIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import AdventsBrand from '@/assets/advents/brand.svg'
import { ContactButton } from '@/components/contact-button'
import { Button } from '@/ui/button'

export const PublicHeader = () => {
  return (
    <header className='absolute flex h-14 w-full px-4 md:px-14'>
      <nav className='flex flex-1 items-center justify-between gap-5'>
        <Image src={AdventsBrand} alt='Logo da Advents' className='w-24' />

        <div className='flex items-center gap-1'>
          <Link href={DOCS_URL} target='_blank' className='hidden md:flex'>
            <Button variant='ghost' size='sm' className='font-normal text-muted-foreground'>
              Documentação
              <MoveUpRightIcon />
            </Button>
          </Link>

          <ContactButton align='end' showDocs={false}>
            <Button variant='ghost' size='sm' className='font-normal text-muted-foreground'>
              Contato
            </Button>
          </ContactButton>
        </div>
      </nav>
    </header>
  )
}
