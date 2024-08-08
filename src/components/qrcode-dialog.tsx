import { Copy, Download } from 'lucide-react'

import { QrCodeSvg } from '@/lib/qrcode'
import { QrProps } from '@/lib/qrcode/types'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'

interface Props {
  children: React.ReactNode
  shortLink: string
}

export const QrCodeDialog = ({ shortLink, children }: Props) => {
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

  return (
    <Dialog>
      {children}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        <div className='flex flex-col items-center justify-center space-y-10 pt-10'>
          <QrCodeSvg config={config} />

          <div className='flex space-x-4'>
            {
              // TODO: Implementar funcionalidade de copiar e baixar QR Code
            }
            <Button className='w-36'>
              <Copy className='mr-2 h-4 w-4' />
              Copiar
            </Button>
            <Button className='w-36'>
              <Download className='mr-2 h-4 w-4' />
              Baixar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
