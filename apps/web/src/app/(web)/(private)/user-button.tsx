import { LogOutIcon, UserIcon } from 'lucide-react'

import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

interface Props {
  email?: string
  signOut: () => void
}

export const UserButton = ({ email, signOut }: Props) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='cursor-pointer' asChild>
        <Button variant='outline' size='icon' className='size-8 rounded-full'>
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='end'>
        <DropdownMenuLabel className='flex items-center gap-2 font-normal text-muted-foreground'>
          <UserIcon className='size-4' />
          {email}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut()} onSelect={e => e.preventDefault()}>
          <LogOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
