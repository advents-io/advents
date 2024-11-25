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
  return <QrCodeSvg config={getConfig(url, size, logoSrc)} />
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
