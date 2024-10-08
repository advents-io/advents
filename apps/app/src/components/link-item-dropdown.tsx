import { EllipsisVertical, Pencil, QrCode, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { DeleteLinkDialog } from '@/components/delete-link-dialog'
import { EditLinkDialog } from '@/components/edit-link-dialog'
import { QrCodeDialog } from '@/components/qrcode-dialog'
import { AlertDialogTrigger } from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
import { DialogTrigger } from '@/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

interface Props {
  id: string
  domain: string
  slug: string
  shortLink: string
  qrcodeLogoUrl?: string
}

export const LinkItemDropdown = ({ id, domain, slug, shortLink, qrcodeLogoUrl }: Props) => {
  const [open, setOpen] = useState(false)

  /* BUG
    We have to add preventDefault to avoid the dropdown to close when clicking on an item.

    That's why we pass the closeDropdown to the Dialogs, to be able to close the dropdown after closing the Dialog.
  */

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          <EllipsisVertical className='size-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        <EditLinkDialog linkId={id} closeDropdown={() => setOpen(false)}>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Pencil className='mr-2 size-4' />
              Editar
            </DropdownMenuItem>
          </DialogTrigger>
        </EditLinkDialog>

        <QrCodeDialog
          domain={domain}
          slug={slug}
          closeDropdown={() => setOpen(false)}
          qrcodeLogoUrl={qrcodeLogoUrl}
        >
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <QrCode className='mr-2 size-4' />
              <span>QR Code</span>
            </DropdownMenuItem>
          </DialogTrigger>
        </QrCodeDialog>

        <DeleteLinkDialog linkId={id} shortLink={shortLink} closeDropdown={() => setOpen(false)}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Trash2 className='mr-2 size-4 text-destructive' />
              <span className='text-destructive'>Excluir</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DeleteLinkDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
