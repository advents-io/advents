import { routes } from '@advents/common'
import {
  CopyIcon,
  DownloadIcon,
  ImageIcon,
  Loader2Icon,
  PenToolIcon,
  QrCodeIcon,
  SquareArrowOutUpRightIcon,
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import { ErrorAlert } from '@/components/error-alert'
import { Button } from '@/ui/button'
import { Card } from '@/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { Label } from '@/ui/label'
import { Switch } from '@/ui/switch'
import { formatShortLink } from '@/utils/link-formatter'

import { getQrCodeCanvas, getQrCodeImage, getQrCodeSvg, QrCode } from './qrcode'

interface Props {
  domain: string
  slug: string
  closeDropdown: () => void
  qrCodeLogoUrl?: string
}

export const QrCodeButton = ({ domain, slug, closeDropdown, qrCodeLogoUrl }: Props) => {
  const { app, team } = useParams<{ team: string; app: string }>()

  const [error, setError] = useState<string>()
  const [open, setOpen] = useState(false)
  const [showLogo, setShowLogo] = useState(!!qrCodeLogoUrl)
  const [isLogoLoaded, setIsLogoLoaded] = useState(false)

  useEffect(() => {
    if (!qrCodeLogoUrl) {
      setIsLogoLoaded(true)
      return
    }

    try {
      const image = new Image()

      image.onload = () => setIsLogoLoaded(true)
      image.onerror = () => setIsLogoLoaded(true)

      image.src = qrCodeLogoUrl
    } catch {
      setIsLogoLoaded(true)
    }
  }, [qrCodeLogoUrl])

  const handleSetOpen = (open: boolean) => {
    setOpen(open)

    if (!open) {
      closeDropdown()
    }
  }

  const shortLink = formatShortLink(domain, slug, true)

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
    const content = await getQrCodeImage(shortLink, 'png', showLogo ? qrCodeLogoUrl : undefined)
    await download(content, 'png')
  }

  const downloadSvg = async () => {
    const content = await getQrCodeSvg(shortLink, showLogo ? qrCodeLogoUrl : undefined)
    await download(content, 'svg')
  }

  const copyToClipboard = async () => {
    try {
      setError(undefined)

      const canvas = await getQrCodeCanvas(shortLink, 'png', showLogo ? qrCodeLogoUrl : undefined)

      canvas.toBlob(async blob => {
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
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
          <QrCodeIcon />
          QR Code
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className='overflow-hidden'>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        <ErrorAlert error={error} />

        <div className='mx-auto w-full max-w-sm space-y-10'>
          <Card className='relative mx-auto w-fit bg-gray-50 p-10'>
            <QrCode url={shortLink} logoSrc={showLogo ? qrCodeLogoUrl : undefined} />

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
                disabled={!qrCodeLogoUrl}
              />

              <Label htmlFor='qrcode-logo'>Exibir logo</Label>
            </div>

            <span className='text-sm text-muted-foreground'>
              {qrCodeLogoUrl ? (
                <span>Logo definida nos </span>
              ) : (
                <span>Para liberar essa opção, adicione uma imagem nos </span>
              )}
              <Link
                className='inline-flex items-center whitespace-pre text-blue-600 hover:underline'
                href={routes.SETTINGS_QRCODE.path(team, app)}
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
              <CopyIcon />
              Copiar
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <DownloadIcon />
                  Baixar
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuItem onClick={downloadSvg}>
                  <PenToolIcon />
                  Formato .svg
                </DropdownMenuItem>

                <DropdownMenuItem onClick={downloadPng}>
                  <ImageIcon />
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
