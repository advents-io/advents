import { CONTACT_EMAIL, DOCS_URL, MEET_SCHEDULER_URL, SUPPORT_WHATSAPP } from '@advents/common'
import { BookOpen, Mail, Video } from 'lucide-react'
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
  modal?: boolean
  align?: 'center' | 'end' | 'start'
}

export const ContactDropdown = ({ children, showDocs = true, modal = true, align }: Props) => {
  return (
    <DropdownMenu modal={modal}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent loop={false} align={align}>
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

        <Link href={MEET_SCHEDULER_URL} target='_blank'>
          <DropdownMenuItem>
            <Video className='mr-2 size-4' />
            Agendar Reunião
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
