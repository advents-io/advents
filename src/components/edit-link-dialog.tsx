'use client'

import { useState } from 'react'

import { CreateEditLinkDialogContent } from '@/components/create-edit-link-dialog-content'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'

interface Props {
  children: React.ReactNode
  linkId: string
  closeDropdown: () => void
}

export const EditLinkDialog = ({ children, linkId, closeDropdown }: Props) => {
  const [open, setOpen] = useState(false)

  const handleSetOpen = (open: boolean) => {
    setOpen(open)

    if (!open) {
      closeDropdown()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleSetOpen}>
      {children}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar link</DialogTitle>
        </DialogHeader>

        <CreateEditLinkDialogContent closeDialog={() => handleSetOpen(false)} linkId={linkId} />
      </DialogContent>
    </Dialog>
  )
}
