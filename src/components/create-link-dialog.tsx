'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'

import { CreateEditLinkDialogContent } from './create-edit-link-dialog-content'

export const CreateLinkDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='lg'>
          <PlusCircle className='mr-2 h-4 w-4' />
          Criar link
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo link</DialogTitle>
        </DialogHeader>

        <CreateEditLinkDialogContent closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
