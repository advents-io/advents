'use client'

import { EllipsisVerticalIcon } from 'lucide-react'
import { useState } from 'react'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/ui/dropdown-menu'

import { DeleteDomainButton } from './delete-domain-button'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  domain: string
}

export const DomainItemMoreOptionsButton = ({ domain, className }: Props) => {
  const [open, setOpen] = useState(false)

  /* BUG: We have to add preventDefault to avoid the dropdown to close when clicking on an item.
   * That's why we pass the closeDropdown to the Dialogs, to be able to close the dropdown after closing the Dialog.
   */

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className={cn('min-h-10 min-w-10', className)}>
          <EllipsisVerticalIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DeleteDomainButton domain={domain} closeDropdown={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
