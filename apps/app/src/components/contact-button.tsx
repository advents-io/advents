import {
  CONTACT_EMAIL,
  DOCS_URLS,
  MEET_SCHEDULER_URL,
  SUPPORT_PHONE,
  whatsapp,
} from '@advents/common'
import { BookOpenIcon, MailIcon, VideoIcon } from 'lucide-react'
import Link from 'next/link'
import { FaWhatsapp as WhatsAppIcon } from 'react-icons/fa'

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

export const ContactButton = ({ children, showDocs = true, modal = true, align }: Props) => {
  return (
    <DropdownMenu modal={modal}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>

      <DropdownMenuContent loop={false} align={align}>
        {showDocs && (
          <Link href={DOCS_URLS.HOME} target='_blank'>
            <DropdownMenuItem>
              <BookOpenIcon />
              Documentação
            </DropdownMenuItem>
          </Link>
        )}

        <Link href={whatsapp.buildMessageUrl(SUPPORT_PHONE)} target='_blank'>
          <DropdownMenuItem>
            <WhatsAppIcon />
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
