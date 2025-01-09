import '../globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { defaultMetadata } from '@/lib/metadata'

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = defaultMetadata

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR' className={`${interFont.className}`}>
      <body className='relative flex min-h-screen flex-col bg-gray-50'>{children}</body>
    </html>
  )
}
