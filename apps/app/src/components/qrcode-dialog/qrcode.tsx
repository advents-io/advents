import { getQrAsCanvas, getQrAsSvgDataUri, QrCodeSvg } from '@/lib/qrcode'
import { QrProps } from '@/lib/qrcode/types'

const getConfig = (url: string, logoSrc?: string): QrProps => ({
  value: url,
  bgColor: '#ffffff',
  fgColor: '#000000',
  size: (1024 * 1.5) / 8,
  level: 'Q', // QR Code error correction level: https://blog.qrstuff.com/general/qr-code-error-correction
  includeMargin: true,
  imageSettings: logoSrc
    ? {
        src: logoSrc,
        height: (256 * 1.6) / 8,
        width: (256 * 1.6) / 8,
        excavate: true,
      }
    : undefined,
})

interface Props {
  url: string
  logoSrc?: string
}

export const QrCode = ({ url, logoSrc }: Props) => {
  return <QrCodeSvg config={getConfig(url, logoSrc)} />
}

export const getQrCodeImage = async (
  url: string,
  type: 'png',
  logoSrc?: string,
): Promise<string> => {
  const config = getConfig(url, logoSrc)
  const image = await getQrAsCanvas(config, `image/${type}`)
  return image as string
}

export const getQrCodeCanvas = async (
  url: string,
  type: 'png',
  logoSrc?: string,
): Promise<HTMLCanvasElement> => {
  const config = getConfig(url, logoSrc)
  const canvas = await getQrAsCanvas(config, `image/${type}`, true)
  return canvas as HTMLCanvasElement
}

export const getQrCodeSvg = async (url: string, logoSrc?: string): Promise<string> => {
  const config = getConfig(url, logoSrc)
  const svg = await getQrAsSvgDataUri(config)
  return svg
}
