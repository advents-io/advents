'use client'

import { PencilIcon } from 'lucide-react'
import { useState } from 'react'

import { CreateEditLinkForm } from '@/components/create-edit-link-form'
import { DropdownMenuItem } from '@/ui/dropdown-menu'
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from '@/ui/responsive-dialog'

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
    <ResponsiveDialog open={open} onOpenChange={handleSetOpen}>
      <ResponsiveDialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
          <PencilIcon />
          Editar
        </DropdownMenuItem>
      </ResponsiveDialogTrigger>

      <ResponsiveDialogContent className='max-w-3xl'>
        <div className='overflow-y-auto md:overflow-y-visible'>
          <ResponsiveDialogHeader>
            <ResponsiveDialogTitle>Editar link</ResponsiveDialogTitle>
          </ResponsiveDialogHeader>

          <CreateEditLinkForm
            className='p-4 md:p-0 md:pt-4'
            closeDialog={() => handleSetOpen(false)}
            linkId={linkId}
          />
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  )
}
