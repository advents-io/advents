import { CopyIcon, DownloadIcon, ImageIcon, PenToolIcon } from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { DialogFooter } from '@/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

import { getQrCodeCanvas, getQrCodeImage, getQrCodeSvg } from './qrcode'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  shortLink: string
  slug: string
  qrCodeLogoUrl?: string
  fgColor?: string
  bgColor?: string
  setError: (error: string | undefined) => void
}

export const QrCodeDialogFooter = ({
  shortLink,
  slug,
  qrCodeLogoUrl,
  fgColor,
  bgColor,
  setError,
  className,
}: Props) => {
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
    const content = await getQrCodeImage(shortLink, 'png', qrCodeLogoUrl, fgColor, bgColor)
    await download(content, 'png')
  }

  const downloadSvg = async () => {
    const content = await getQrCodeSvg(shortLink, qrCodeLogoUrl, fgColor, bgColor)
    await download(content, 'svg')
  }

  const copyToClipboard = async () => {
    try {
      setError(undefined)

      const canvas = await getQrCodeCanvas(shortLink, 'png', qrCodeLogoUrl, fgColor, bgColor)

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
    <DialogFooter className={cn('-mx-6 -mb-6 border-t bg-gray-50 p-6', className)}>
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
            <DropdownMenuItem onClick={downloadPng} className='hover:cursor-pointer'>
              <ImageIcon />
              Formato <span className='rounded-sm bg-gray-200 px-1 font-mono'>.png</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={downloadSvg} className='hover:cursor-pointer'>
              <PenToolIcon />
              Formato <span className='rounded-sm bg-gray-200 px-1 font-mono'>.svg</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* This is used to prompt downloads. */}
      <a className='hidden' download={`${slug}-qrcode.svg`} ref={anchorRef} />
    </DialogFooter>
  )
}
