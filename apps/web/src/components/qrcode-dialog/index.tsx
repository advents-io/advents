import { routes } from '@advents/common'
import { SquareArrowOutUpRightIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'

import { ColorPicker } from '@/components/color-picker'
import { ErrorAlert } from '@/components/error-alert'
import { useMediaQuery } from '@/hooks/use-media-query'
import { Card } from '@/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog'
import { Label } from '@/ui/label'
import { Switch } from '@/ui/switch'
import { formatShortLink } from '@/utils/link-formatter'

import { QrCode } from './qrcode'
import { QrCodeDialogFooter } from './qrcode-dialog-footer'

interface Props {
  domain: string
  slug: string
  closeDropdown: () => void
  qrCodeLogoUrl?: string
  children: React.ReactNode
}

export const QrCodeDialog = ({ domain, slug, closeDropdown, qrCodeLogoUrl, children }: Props) => {
  const { app, team } = useParams<{ team: string; app: string }>()

  const [error, setError] = useState<string>()
  const [open, setOpen] = useState(false)
  const [showLogo, setShowLogo] = useState(!!qrCodeLogoUrl)
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')

  const isTablet = useMediaQuery('(min-width: 640px)')
  const isNotebook = useMediaQuery('(min-width: 768px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const size = isDesktop ? 300 : isNotebook ? 250 : isTablet ? 200 : 100

  const handleSetOpen = (open: boolean) => {
    setOpen(open)

    if (!open) {
      closeDropdown()
    }
  }

  const shortLink = formatShortLink(domain, slug, true)

  return (
    <Dialog open={open} onOpenChange={handleSetOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='bg-gray-50'>
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
        </DialogHeader>

        <ErrorAlert error={error} />

        <div className='mx-auto w-full space-y-10'>
          <Card className='mx-auto w-fit overflow-hidden bg-gray-50 shadow-md'>
            <QrCode
              url={shortLink}
              size={size}
              logoSrc={showLogo ? qrCodeLogoUrl : undefined}
              fgColor={fgColor}
              bgColor={bgColor}
            />
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

          <div>
            <Label>Cor do QR Code</Label>
            <ColorPicker selectedColor={fgColor} setSelectedColor={setFgColor} />
          </div>

          <div>
            <Label>Cor do fundo</Label>
            <ColorPicker selectedColor={bgColor} setSelectedColor={setBgColor} includeTransparent />
          </div>
        </div>

        <QrCodeDialogFooter
          className='mt-4 rounded-b-lg'
          shortLink={shortLink}
          slug={slug}
          qrCodeLogoUrl={showLogo ? qrCodeLogoUrl : undefined}
          fgColor={fgColor}
          bgColor={bgColor}
          setError={setError}
        />
      </DialogContent>
    </Dialog>
  )
}
