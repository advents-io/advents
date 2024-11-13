'use client'

import { PencilIcon } from 'lucide-react'
import { useState } from 'react'

import { CreateEditLinkForm } from '@/components/create-edit-link-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'
import { DropdownMenuItem } from '@/ui/dropdown-menu'

interface Props {
  linkId: string
  closeDropdown: () => void
}

export const EditLinkButton = ({ linkId, closeDropdown }: Props) => {
  const [open, setOpen] = useState(false)

  const handleSetOpen = (open: boolean) => {
    setOpen(open)

    if (!open) {
      closeDropdown()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleSetOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
          <PencilIcon />
          Editar
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Editar link</DialogTitle>
        </DialogHeader>

        <CreateEditLinkForm closeDialog={() => handleSetOpen(false)} linkId={linkId} />
      </DialogContent>
    </Dialog>
  )
}
