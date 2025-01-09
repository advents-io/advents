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
        <div className='overflow-y-auto md:overflow-y-visible'>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Criar novo link</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>

          <CreateEditLinkForm className='p-4 md:p-0 md:pt-4' closeDialog={() => setOpen(false)} />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
