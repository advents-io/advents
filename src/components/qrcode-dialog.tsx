import { AlertCircle, Copy, Download, ImageIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { getQrAsCanvas, QrCodeSvg } from '@/lib/qrcode'
import { QrProps } from '@/lib/qrcode/types'
import { Alert, AlertDescription, AlertTitle } from '@/ui/alert'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { getErrorMessage } from '@/utils/error-formatter'

interface Props {
  children: React.ReactNode
  shortLink: string
}

export const QrCodeDialog = ({ shortLink, children }: Props) => {
  const [error, setError] = useState<string>()

  const config: QrProps = {
    value: shortLink,
    bgColor: '#ffffff',
    fgColor: '#000000',
    size: (1024 * 1.5) / 8,
    level: 'Q', // QR Code error correction level: https://blog.qrstuff.com/general/qr-code-error-correction
    includeMargin: false,
    imageSettings: {
      src: '/logo-qrcode.png', // TODO: alterar pela logo da empresa
      height: (256 * 1.6) / 8,
      width: (256 * 1.6) / 8,
      excavate: true,
    },
  }

  const copyToClipboard = async () => {
    try {
      const canvas = await getQrAsCanvas(config, 'image/png', true)

      ;(canvas as HTMLCanvasElement).toBlob(async blob => {
        const item = new ClipboardItem({
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          'image/png': blob,
        })
        await navigator.clipboard.write([item])

        toast.success('Imagem do QR Code copiada.')
      })
    } catch (error) {
      const message = await getErrorMessage(error)
      setError(message)
    }
  }

  return (
    <Dialog>
      {children}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant='destructive'>
            <AlertCircle className='h-4 w-4' />
            <AlertTitle>Ops!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className='flex flex-col items-center justify-center space-y-10 pt-10'>
          <QrCodeSvg config={config} />

          <div className='flex space-x-4'>
            <Button className='w-36' onClick={copyToClipboard}>
              <Copy className='mr-2 h-4 w-4' />
              Copiar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='w-36'>
                  <Download className='mr-2 h-4 w-4' />
                  Baixar
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem>
                  <ImageIcon className='mr-2 h-4 w-4' />
                  Formato .svg
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ImageIcon className='mr-2 h-4 w-4' />
                  Formato .png
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
