import { Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { getQrAsCanvas, getQrAsSvgDataUri, QrCodeSvg } from '@/lib/qrcode'
import { QrProps } from '@/lib/qrcode/types'

const getConfig = (url: string, size: number, logoSrc?: string): QrProps => ({
  value: url,
  bgColor: '#ffffff',
  fgColor: '#000000',
  size,
  level: 'Q', // QR Code error correction level: https://blog.qrstuff.com/general/qr-code-error-correction
  includeMargin: true,
  imageSettings: logoSrc
    ? {
        src: logoSrc,
        excavate: true,
      }
    : undefined,
})

interface Props {
  url: string
  size: number
  logoSrc?: string
}

export const QrCode = ({ url, size, logoSrc }: Props) => {
  const [isLogoLoaded, setIsLogoLoaded] = useState(false)

  useEffect(() => {
    if (!logoSrc) {
      setIsLogoLoaded(true)
      return
    }

    try {
      const image = new Image()

      image.onload = () => setIsLogoLoaded(true)
      image.onerror = () => setIsLogoLoaded(true)

      image.src = logoSrc
    } catch {
      setIsLogoLoaded(true)
    }
  }, [logoSrc])

  const config = getConfig(url, size, logoSrc)

  return (
    <div className='relative'>
      <QrCodeSvg config={config} />

      {!isLogoLoaded && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <div
            className='flex size-[69px] items-center justify-center'
            style={{ backgroundColor: config.bgColor }}
          >
            <Loader2Icon className='size-8 animate-spin' />
          </div>
        </div>
      )}
    </div>
  )
}

export const getQrCodeImage = async (
  url: string,
  type: 'png',
  logoSrc?: string,
): Promise<string> => {
  const config = getConfig(url, 1024, logoSrc)
  const image = await getQrAsCanvas(config, `image/${type}`)
  return image as string
}

export const getQrCodeCanvas = async (
  url: string,
  type: 'png',
  logoSrc?: string,
): Promise<HTMLCanvasElement> => {
  const config = getConfig(url, 1024, logoSrc)
  const canvas = await getQrAsCanvas(config, `image/${type}`, true)
  return canvas as HTMLCanvasElement
}

export const getQrCodeSvg = async (url: string, logoSrc?: string): Promise<string> => {
  const config = getConfig(url, 1024, logoSrc)
  const svg = await getQrAsSvgDataUri(config)
  return svg
}
