import { CONTACT_EMAIL, DOCS_URL, SUPPORT_WHATSAPP } from '@advents/common'
import { BookOpen, Mail } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import WhatsApp from '@/assets/icons/whatsapp.svg'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

interface Props {
  children: React.ReactNode
  showDocs?: boolean
}

export const ContactDropdown = ({ children, showDocs = true }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent>
        {showDocs && (
          <Link href={DOCS_URL} target='_blank'>
            <DropdownMenuItem>
              <BookOpen className='mr-2 size-4' />
              Documentação
            </DropdownMenuItem>
          </Link>
        )}

        <Link href={SUPPORT_WHATSAPP} target='_blank'>
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
