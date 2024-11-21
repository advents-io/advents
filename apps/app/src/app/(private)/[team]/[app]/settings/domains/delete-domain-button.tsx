'use client'

import { deleteCustomDomainAction, formatErrors, useAction } from '@advents/mutations'
import { Trash2Icon } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingContent } from '@/components/loading-content'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
import { DropdownMenuItem } from '@/ui/dropdown-menu'

interface Props {
  domain: string
  closeDropdown: () => void
}

export const DeleteDomainButton = ({ domain, closeDropdown }: Props) => {
  const [open, setOpen] = useState(false)
  const { app: appSlug } = useParams<{ app: string }>()

  const handleSetOpen = (open: boolean) => {
    setOpen(open)

    if (!open) {
      closeDropdown()
    }
  }

  const {
    execute: deleteDomain,
    isExecuting,
    result,
  } = useAction(deleteCustomDomainAction, {
    onSuccess: ({ data }) => {
      handleSetOpen(false)

      if (data) {
        window.open(data.whatsappUrl, '_blank')
      }
    },
  })

  const error = formatErrors(result)

  return (
    <AlertDialog open={open} onOpenChange={handleSetOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
          <Trash2Icon className='text-destructive' />
          <span className='text-destructive'>Excluir</span>
        </DropdownMenuItem>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir {domain}</AlertDialogTitle>

          <ErrorAlert error={error} />

          <AlertDialogDescription>
            Você será direcionado para o WhatsApp para finalizar o processo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <Button
            variant='destructive'
            onClick={() => deleteDomain({ appSlug, domain })}
            disabled={isExecuting}
          >
            <LoadingContent loading={isExecuting}>Continuar</LoadingContent>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
