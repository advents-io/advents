import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAction } from 'next-safe-action/hooks'
import { useState } from 'react'
import { toast } from 'sonner'

import { deleteLinkAction } from '@/actions/link/delete-link-action'
import { formatErrors } from '@/actions/safe-action'
import { LoadingContent } from '@/components/loading-content'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
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
          <AlertDialogTitle>Deletar {shortLink}</AlertDialogTitle>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='size-4' />
              <AlertTitle>Ops!</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <AlertDialogDescription>
            Essa ação é irreversível. Isso irá deletar permanentemente o link e todas as suas
            informações.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

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
