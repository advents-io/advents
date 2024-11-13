'use client'

import { PlusIcon } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'

import { CreateEditLinkForm } from '@/components/create-edit-link-form'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'

export const CreateLinkButton = ({ children, className }: HTMLAttributes<HTMLDivElement>) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={className}>
          {children || (
            <Button size='lg'>
              <PlusIcon />
              Criar link
            </Button>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className='max-w-3xl'>
        <DialogHeader>
          <DialogTitle>Criar novo link</DialogTitle>
        </DialogHeader>

        <CreateEditLinkForm closeDialog={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
