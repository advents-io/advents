'use client'

import { PlusIcon } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'

import { CreateEditLinkForm } from '@/components/create-edit-link-form'
import { Button } from '@/ui/button'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/ui/responsive-dialog'

export const CreateLinkButton = ({ children, className }: HTMLAttributes<HTMLDivElement>) => {
  const [open, setOpen] = useState(false)

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <ResponsiveDialogTrigger asChild>
        <div className={className}>
          {children || (
            <Button size='lg'>
              <PlusIcon />
              Criar link
            </Button>
          )}
        </div>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent className='max-w-3xl'>
        <ResponsiveDialogHeader>
          <ResponsiveDialogTitle>Criar novo link</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <CreateEditLinkForm closeDialog={() => setOpen(false)} />
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
