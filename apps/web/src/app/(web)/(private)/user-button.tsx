'use client'

import { routes } from '@advents/common'
import { supabaseClient } from '@advents/supabase/client'
import { LogOutIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

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
  email: string
}

export const UserButton = ({ email }: Props) => {
  const router = useRouter()

  const supabase = supabaseClient()

  const signOut = () => {
    supabase.auth.signOut()
    router.push(routes.SIGN_IN.path)
  }

  const isAdminUser = email.endsWith('@advents.io')

  const copyJwt = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return
    }

    navigator.clipboard.writeText(session.access_token)

    toast('Token copiado.')
  }

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

        {isAdminUser && (
          <Button size='sm' variant='secondary' className='mt-2 w-full' onClick={copyJwt}>
            Copiar JWT
          </Button>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut()} onSelect={e => e.preventDefault()}>
          <LogOutIcon />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
