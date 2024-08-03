'use client'

import { useState } from 'react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'

import { CreateEditLinkDialogContent } from './create-edit-link-dialog-content'

export const EditLinkDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo link</DialogTitle>
        </DialogHeader>

        <CreateEditLinkDialogContent closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
