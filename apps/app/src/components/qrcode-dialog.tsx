import { routes } from '@advents/common'
import {
  CopyIcon,
  DownloadIcon,
  ImageIcon,
  Loader2Icon,
  SquareArrowOutUpRightIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { getQrAsCanvas, getQrAsSvgDataUri, QrCodeSvg } from '@/lib/qrcode'
import { QrProps } from '@/lib/qrcode/types'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/ui/dialog'
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
  const { app, team } = useParams<{ team: string; app: string }>()

  const [error, setError] = useState<string>()
  const [open, setOpen] = useState(false)
  const [showLogo, setShowLogo] = useState(!!qrcodeLogoUrl)
  const [isLogoLoaded, setIsLogoLoaded] = useState(false)

  useEffect(() => {
    if (!qrcodeLogoUrl) {
      setIsLogoLoaded(true)
      return
    }

    try {
      const image = new Image()

      image.onload = () => setIsLogoLoaded(true)
      image.onerror = () => setIsLogoLoaded(true)

      image.src = qrcodeLogoUrl
    } catch {
      setIsLogoLoaded(true)
    }
  }, [qrcodeLogoUrl])

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

      <DialogContent className='overflow-hidden'>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        <ErrorAlert error={error} />

        <div className='mx-auto w-full max-w-sm space-y-10'>
          <Card className='relative mx-auto w-fit bg-gray-50 p-10'>
            <QrCodeSvg config={config} />

            {!isLogoLoaded && (
              <div className='absolute inset-0 flex items-center justify-center'>
                <div className='flex size-[60px] items-center justify-center bg-gray-50'>
                  <Loader2Icon className='size-8 animate-spin' />
                </div>
              </div>
            )}
          </Card>

          <div className='flex flex-col gap-2'>
            <div className='relative flex gap-2'>
              <Switch
                id='qrcode-logo'
                checked={showLogo}
                onCheckedChange={setShowLogo}
                disabled={!qrcodeLogoUrl}
              />

              <Label htmlFor='qrcode-logo'>Exibir logo</Label>
            </div>

            <span className='text-sm text-muted-foreground'>
              {qrcodeLogoUrl ? (
                <span>Endereço da logo definido nos </span>
              ) : (
                <span>Para liberar essa opção, adicione o endereço da logo do QR Code nos </span>
              )}
              <Link
                className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                href={routes.SETTINGS.path(team, app)}
                target='_blank'
              >
                ajustes do app. <SquareArrowOutUpRightIcon className='size-4' />
              </Link>
            </span>
          </div>
        </div>

        <DialogFooter className='-mx-6 -mb-6 mt-4 border-t bg-gray-50 p-6'>
          <div className='space-x-2'>
            <Button onClick={copyToClipboard}>
              <CopyIcon className='mr-2 size-4' />
              Copiar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <DownloadIcon className='mr-2 size-4' />
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

          {/* This is used to prompt downloads. */}
          <a className='hidden' download={`${slug}-qrcode.svg`} ref={anchorRef} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
