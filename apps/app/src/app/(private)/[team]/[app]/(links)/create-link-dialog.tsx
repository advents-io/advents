'use client'

import { Plus } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'

import { CreateEditLinkForm } from '@/components/create-edit-link-form'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'

export const CreateLinkDialog = ({ children, className }: HTMLAttributes<HTMLDivElement>) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={className}>
          {children || (
            <Button size='lg'>
              <Plus className='mr-2 size-4' />
              Criar link
            </Button>
          )}
        </div>
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
