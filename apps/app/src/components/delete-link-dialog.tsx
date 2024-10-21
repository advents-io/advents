import { deleteLinkAction, formatErrors, useAction } from '@advents/mutations'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

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
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'

interface Props {
  linkId: string
  shortLink: string
  children: React.ReactNode
  closeDropdown: () => void
}

export const DeleteLinkDialog = ({ children, linkId, shortLink, closeDropdown }: Props) => {
  const [open, setOpen] = useState(false)
  const { refresh } = useRouter()

  const handleSetOpen = (open: boolean) => {
    setOpen(open)

    if (!open) {
      closeDropdown()
    }
  }

  const {
    execute: deleteLink,
    isExecuting,
    result,
  } = useAction(deleteLinkAction, {
    onSuccess: () => {
      handleSetOpen(false)
      toast('Link excluído com sucesso.')
      refresh()
    },
  })

  const error = formatErrors(result)

  return (
    <AlertDialog open={open} onOpenChange={handleSetOpen}>
      {children}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir {shortLink}</AlertDialogTitle>

          <ErrorAlert error={error} />

          <AlertDialogDescription>
            Essa ação é irreversível. Isso irá excluir permanentemente o link e todas as suas
            informações e estatísticas de uso.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <Button
            variant='destructive'
            onClick={() => deleteLink({ linkId })}
            disabled={isExecuting}
          >
            <LoadingContent loading={isExecuting}>Continuar</LoadingContent>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
