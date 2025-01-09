import '../globals.css'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata } from 'next'
import { Inter, JetBrains_Mono as JetBrainsMono } from 'next/font/google'
import { Suspense } from 'react'

import { defaultMetadata } from '@/lib/metadata'
import { PostHogPageView } from '@/lib/posthog/page-view'
import { PostHogProvider } from '@/lib/posthog/provider'
import { Toaster } from '@/ui/sonner'

import { HelpButton } from './help-button'
import { Providers } from './providers'

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
})

const jetBrainsMonoFont = JetBrainsMono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

export const metadata: Metadata = defaultMetadata

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR' className={`${interFont.className} ${jetBrainsMonoFont.variable}`}>
      <PostHogProvider>
        <body className='relative flex min-h-screen flex-col bg-gray-50' suppressHydrationWarning>
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
