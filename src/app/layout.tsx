import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from '@/ui/sonner'
import { TooltipProvider } from '@/ui/tooltip'

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Advents',
  description: 'Deep links de forma fácil!',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='pt-BR' className={interFont.className}>
      <body className='flex min-h-screen flex-col'>
        <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
        <Toaster richColors closeButton theme='light' />
      </body>
    </html>
  )
}
