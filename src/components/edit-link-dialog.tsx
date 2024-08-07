'use client'

import { useState } from 'react'

import { CreateEditLinkDialogContent } from '@/components/create-edit-link-dialog-content'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'

interface Props {
  children: React.ReactNode
  linkId: string
}

export const EditLinkDialog = ({ children, linkId }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar link</DialogTitle>
        </DialogHeader>

        <CreateEditLinkDialogContent closeDialog={() => setOpen(false)} linkId={linkId} />
      </DialogContent>
    </Dialog>
  )
}
