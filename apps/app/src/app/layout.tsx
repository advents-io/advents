import './globals.css'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Suspense } from 'react'

import { PostHogPageView } from '@/lib/posthog/page-view'
import { PostHogProvider } from '@/lib/posthog/provider'
import { Toaster } from '@/ui/sonner'

import { HelpButton } from './help-button'
import { Providers } from './providers'

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const title = 'Advents | Links únicos e mensuráveis para seus apps'
const description =
  'A Advents é a alternativa brasileira à AppsFlyer. Crie links únicos para seu apps Android e iOS. Meça o resultado das campanhas de instalação com nossa ferramenta de atribuição e analytics, e engaje seus usuários com deep links.'

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: 'https://app.advents.io',
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon-light.png',
      media: '(prefers-color-scheme: light)',
    },
    {
      rel: 'icon',
      type: 'image/png',
      url: '/favicon-dark.png',
      media: '(prefers-color-scheme: dark)',
    },
  ],
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR' className={interFont.className}>
      <PostHogProvider>
        <body className='relative flex min-h-screen flex-col bg-gray-50'>
          <Suspense>
            <PostHogPageView />
          </Suspense>
          <Providers>{children}</Providers>
          <HelpButton />
          <Toaster richColors closeButton theme='light' />
          <SpeedInsights debug={false} />
          <Analytics debug={false} />
        </body>
      </PostHogProvider>
    </html>
  )
}
