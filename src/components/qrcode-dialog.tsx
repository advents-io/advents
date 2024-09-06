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
import { Label } from '@/ui/label'
import { Switch } from '@/ui/switch'
import { formatShortLink } from '@/utils/link-formatter'

interface Props {
  children: React.ReactNode
  domain: string
  slug: string
  closeDropdown: () => void
  qrcodeLogoUrl?: string
}

export const QrCodeDialog = ({ domain, slug, children, closeDropdown, qrcodeLogoUrl }: Props) => {
  const [error, setError] = useState<string>()
  const [open, setOpen] = useState(false)
  const [showLogo, setShowLogo] = useState(!!qrcodeLogoUrl)

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
    imageSettings:
      showLogo && qrcodeLogoUrl
        ? {
            src: qrcodeLogoUrl,
            height: (256 * 1.6) / 8,
            width: (256 * 1.6) / 8,
            excavate: true,
          }
        : undefined,
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

        <div className='w-full pt-10'>
          <div className='mx-auto flex max-w-xs flex-col items-center gap-10'>
            <QrCodeSvg config={config} />

            <div className='flex flex-col gap-2'>
              <div className='relative flex gap-2'>
                <Switch
                  id='qrcode-logo'
                  checked={showLogo}
                  onCheckedChange={setShowLogo}
                  disabled={!qrcodeLogoUrl}
                />

                <Label htmlFor='qrcode-logo'>Exibir logo padrão</Label>
              </div>

              <span className='text-sm text-muted-foreground'>
                {qrcodeLogoUrl
                  ? 'Endereço da logo definido nos ajustes do app.'
                  : 'Para liberar essa opção, adicione o endereço da logo do QR Code nos ajustes do app.'}
              </span>
            </div>

            <div className='flex w-full justify-between'>
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
        </div>
      </DialogContent>
    </Dialog>
  )
}
