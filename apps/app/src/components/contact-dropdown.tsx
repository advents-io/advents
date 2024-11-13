import { CONTACT_EMAIL, DOCS_URL, MEET_SCHEDULER_URL, SUPPORT_PHONE } from '@advents/common'
import { BookOpenIcon, MailIcon, VideoIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import WhatsApp from '@/assets/icons/whatsapp.svg'
import { whatsapp } from '@/lib/whatsapp'
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
              <BookOpenIcon />
              Documentação
            </DropdownMenuItem>
          </Link>
        )}

        <Link href={whatsapp.buildMessageUrl(SUPPORT_PHONE)} target='_blank'>
          <DropdownMenuItem>
            <Image src={WhatsApp} alt='WhatsApp' className='size-4' />
            WhatsApp
          </DropdownMenuItem>
        </Link>

        <Link href={`mailto:${CONTACT_EMAIL}`} target='_blank'>
          <DropdownMenuItem>
            <MailIcon />
            E-mail
          </DropdownMenuItem>
        </Link>

        <Link href={MEET_SCHEDULER_URL} target='_blank'>
          <DropdownMenuItem>
            <VideoIcon />
            Agendar Reunião
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
