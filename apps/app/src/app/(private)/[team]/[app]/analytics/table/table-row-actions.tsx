'use client'

import { EllipsisVertical } from 'lucide-react'

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

// TODO: implement

export const TableRowActions = () => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
          <EllipsisVertical className='size-4' />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuItem>Editar</DropdownMenuItem>
        <DropdownMenuItem>Excluir</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
