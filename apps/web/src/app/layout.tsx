import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Advents',
  description: 'O futuro das MMPs.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR' className={interFont.className}>
      <body>{children}</body>
    </html>
  )
}
