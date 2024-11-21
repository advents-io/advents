import { deleteAppAction, formatErrors, useAction } from '@advents/mutations'
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
  AlertDialogTrigger,
} from '@/ui/alert-dialog'
import { Button } from '@/ui/button'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import { Separator } from '@/ui/separator'

interface Props {
  appId: string
  appSlug: string
  appName: string
  children: React.ReactNode
}

export const DeleteAppButton = ({ appId, appSlug, appName, children }: Props) => {
  const [open, setOpen] = useState(false)
  const [confirmAppName, setConfirmAppName] = useState('')

  const {
    execute: deleteApp,
    isExecuting,
    result,
  } = useAction(deleteAppAction, {
    onSuccess: () => {
      setOpen(false)
      toast('App excluído com sucesso.')
    },
  })

  const confirmedAppName = confirmAppName === appSlug

  const error = formatErrors(result)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir {appName}</AlertDialogTitle>

          <ErrorAlert error={error} />

          <AlertDialogDescription className='pb-5'>
            Essa ação é irreversível. Isso irá excluir permanentemente o app, os links associados,
            as informações e estatísticas de uso.
          </AlertDialogDescription>

          <Separator />

          <Label htmlFor='confirm-app-name' className='pt-5 font-normal'>
            Digite o identificador <b>{appSlug}</b> para continuar:
          </Label>
          <Input
            id='confirm-app-name'
            value={confirmAppName}
            onChange={e => setConfirmAppName(e.target.value)}
            placeholder={appSlug}
          />
        </AlertDialogHeader>

        <AlertDialogFooter className='pt-5'>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>

          <Button
            variant='destructive'
            disabled={isExecuting || !confirmedAppName}
            onClick={() => deleteApp({ id: appId })}
          >
            <LoadingContent loading={isExecuting}>Excluir app</LoadingContent>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
