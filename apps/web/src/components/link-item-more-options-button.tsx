import { EllipsisVerticalIcon } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'

import { DeleteLinkButton } from '@/components/delete-link-button'
import { EditLinkButton } from '@/components/edit-link-button'
import { QrCodeButton } from '@/components/qrcode-dialog/qrcode-button'
import { Button } from '@/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/ui/dropdown-menu'

interface Props extends HTMLAttributes<HTMLButtonElement> {
  id: string
  domain: string
  slug: string
  qrCodeLogoUrl?: string
}

export const LinkItemMoreOptionsButton = ({ id, domain, slug, qrCodeLogoUrl, ...props }: Props) => {
  const [open, setOpen] = useState(false)

  const shortLink = `${domain}/${slug}`

  /* We have to add preventDefault to avoid the dropdown to close when clicking on an item.
   * That's why we pass the closeDropdown to the Dialogs, to be able to close the dropdown after closing the Dialog.
   * We may fix this in the future.
   */

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' {...props}>
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <EditLinkButton linkId={id} closeDropdown={() => setOpen(false)} />

        <QrCodeButton
          domain={domain}
          slug={slug}
          closeDropdown={() => setOpen(false)}
          qrCodeLogoUrl={qrCodeLogoUrl}
        />

        <DeleteLinkButton linkId={id} shortLink={shortLink} closeDropdown={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
