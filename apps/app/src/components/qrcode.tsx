import { getQrAsCanvas, getQrAsSvgDataUri, QrCodeSvg } from '@/lib/qrcode'
import { QrProps } from '@/lib/qrcode/types'

interface Props {
  url: string
  logoSrc?: string
}

export const QrCode = ({ url, logoSrc }: Props) => {
  return <QrCodeSvg config={config(url, logoSrc)} />
}

export const getQrCodeImage = async (
  url: string,
  type: 'png',
  logoSrc?: string,
): Promise<string> => {
  const image = (await getQrAsCanvas(config(url, logoSrc), `image/${type}`)) as string
  return image
}

export const getQrCodeCanvas = async (
  url: string,
  type: 'png',
  logoSrc?: string,
): Promise<HTMLCanvasElement> => {
  const canvas = (await getQrAsCanvas(
    config(url, logoSrc),
    `image/${type}`,
    true,
  )) as HTMLCanvasElement

  return canvas
}

export const getQrCodeSvg = async (url: string, logoSrc?: string): Promise<string> => {
  const svg = await getQrAsSvgDataUri(config(url, logoSrc))
  return svg
}

const config = (url: string, logoSrc?: string): QrProps => ({
  value: url,
  bgColor: '#ffffff',
  fgColor: '#000000',
  size: (1024 * 1.5) / 8,
  level: 'Q', // QR Code error correction level: https://blog.qrstuff.com/general/qr-code-error-correction
  includeMargin: false,
  imageSettings: logoSrc
    ? {
        src: logoSrc,
        height: (256 * 1.6) / 8,
        width: (256 * 1.6) / 8,
        excavate: true,
      }
    : undefined,
})
