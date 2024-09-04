'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { CreateEditLinkForm } from '@/components/create-edit-link-form'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'

export const CreateLinkDialog = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size='lg'>
          <PlusCircle className='mr-2 size-4' />
          Criar link
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar novo link</DialogTitle>
        </DialogHeader>

        <CreateEditLinkForm closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
