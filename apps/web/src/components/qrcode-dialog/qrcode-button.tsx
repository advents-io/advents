import { QrCodeIcon } from 'lucide-react'

import { DropdownMenuItem } from '@/ui/dropdown-menu'

import { QrCodeDialog } from '.'

interface Props {
  domain: string
  slug: string
  closeDropdown: () => void
  qrCodeLogoUrl?: string
}

export const QrCodeButton = ({ domain, slug, closeDropdown, qrCodeLogoUrl }: Props) => {
  return (
    <QrCodeDialog
      qrCodeLogoUrl={qrCodeLogoUrl}
      domain={domain}
      slug={slug}
      closeDropdown={closeDropdown}
    >
      <DropdownMenuItem onSelect={e => e.preventDefault()}>
        <QrCodeIcon />
        QR Code
      </DropdownMenuItem>
    </QrCodeDialog>
  )
}
