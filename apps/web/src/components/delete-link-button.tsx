import { deleteLinkAction, formatErrors, useAction } from '@advents/mutations'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { LoadingContent } from '@/components/loading-content'
import { useAnalyticsTableLinks } from '@/contexts/analytics-table-links-context'
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
  linkId: string
  shortLink: string
  closeDropdown: () => void
}

export const DeleteLinkButton = ({ linkId, shortLink, closeDropdown }: Props) => {
  const [open, setOpen] = useState(false)
  const { refresh } = useRouter()
  const { removeLink: removeAnalyticsTableLink } = useAnalyticsTableLinks()

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

      toast('Link excluído.')

      if (removeAnalyticsTableLink) {
        removeAnalyticsTableLink(linkId)
      }

      refresh()
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
