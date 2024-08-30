import ky from 'ky'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { LoadingContent } from '@/components/loading-content'
import { getErrorMessage } from '@/http/error-formatter'
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
}

export const DeleteLinkDialog = ({ children, linkId, shortLink }: Props) => {
  const [error, setError] = useState<string>()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { refresh } = useRouter()

  const deleteLink = async () => {
    try {
      setError(undefined)
      setLoading(true)

      await ky.delete(`/api/links/${linkId}`)

      setOpen(false)

      toast('Link excluído com sucesso.')

      refresh()
    } catch (e) {
      const error = await getErrorMessage(e)
      setError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {children}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar {shortLink}</AlertDialogTitle>

          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
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

          <Button variant='destructive' onClick={deleteLink} disabled={loading}>
            <LoadingContent loading={loading}>Continuar</LoadingContent>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
