import { Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsApp from 'public/icons/whatsapp.svg'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { CONTACT_EMAIL, CONTACT_WHATSAPP } from '@/utils/constants'

interface Props {
  children: React.ReactNode
}

export const ContactDropdown = ({ children }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent>
        <Link href={CONTACT_WHATSAPP} target='_blank'>
          <DropdownMenuItem>
            <Image src={WhatsApp} alt='WhatsApp' className='mr-2 size-4' />
            WhatsApp
          </DropdownMenuItem>
        </Link>

        <Link href={`mailto:${CONTACT_EMAIL}`} target='_blank'>
          <DropdownMenuItem>
            <Mail className='mr-2 size-4' />
            E-mail
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
