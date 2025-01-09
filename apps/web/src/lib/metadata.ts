import type { Metadata } from 'next'

const title = 'Advents | A plataforma para crescer seu app'
const description =
  'Advents é uma alternativa à AppsFlyer e ao Firebase Dynamic Links. Impulsione suas campanhas de instalação com a evolução da atribuição mobile.'

export const defaultMetadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: 'https://app.advents.io',
  },
  metadataBase: new URL('https://app.advents.io'),
  openGraph: {
    type: 'website',
    title,
    description,
    siteName: 'Advents',
    url: '/',
    images: {
      url: '/og.png',
      type: 'image/png',
      width: 1200,
      height: 630,
      alt: 'Advents',
    },
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: {
      url: '/og.png',
      type: 'image/png',
      width: 1200,
      height: 630,
      alt: 'Advents',
    },
  },
}
