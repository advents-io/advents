import { Copy, Download, ImageIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { getQrAsCanvas, getQrAsSvgDataUri, QrCodeSvg } from '@/lib/qrcode'
import { QrProps } from '@/lib/qrcode/types'
import { Button } from '@/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { formatShortLink } from '@/utils/link-formatter'

interface Props {
  children: React.ReactNode
  domain: string
  slug: string
  closeDropdown: () => void
}

export const QrCodeDialog = ({ domain, slug, children, closeDropdown }: Props) => {
  const [error, setError] = useState<string>()
  const [open, setOpen] = useState(false)

  const handleSetOpen = (open: boolean) => {
    setOpen(open)

    if (!open) {
      closeDropdown()
    }
  }

  const shortLink = formatShortLink(domain, slug, true)

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

  const anchorRef = useRef<HTMLAnchorElement>(null)

  const download = async (url: string, extension: string) => {
    if (!anchorRef.current) {
      return
    }

    try {
      setError(undefined)

      anchorRef.current.href = url
      anchorRef.current.download = `${slug}-qrcode.${extension}`
      anchorRef.current.click()

      toast.success('Imagem do QR Code baixada.')
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    }
  }

  const downloadPng = async () => {
    const content = (await getQrAsCanvas(config, 'image/png')) as string
    await download(content, 'png')
  }

  const downloadSvg = async () => {
    const content = await getQrAsSvgDataUri(config)
    await download(content, 'svg')
  }

  const copyToClipboard = async () => {
    try {
      setError(undefined)

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
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleSetOpen}>
      {children}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        <ErrorAlert error={error} />

        <div className='flex flex-col items-center justify-center space-y-10 pt-10'>
          <QrCodeSvg config={config} />

          <div className='flex space-x-4'>
            <Button className='w-36' onClick={copyToClipboard}>
              <Copy className='mr-2 size-4' />
              Copiar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='w-36'>
                  <Download className='mr-2 size-4' />
                  Baixar
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onClick={downloadSvg}>
                  <ImageIcon className='mr-2 size-4' />
                  Formato .svg
                </DropdownMenuItem>

                <DropdownMenuItem onClick={downloadPng}>
                  <ImageIcon className='mr-2 size-4' />
                  Formato .png
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* This will be used to prompt downloads. */}
          <a className='hidden' download={`${slug}-qrcode.svg`} ref={anchorRef} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
