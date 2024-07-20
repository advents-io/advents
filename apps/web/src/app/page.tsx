'use client'

import { prisma } from '@advents/prisma'

import { Button } from '@/components/ui/button'

export default function Home() {
  const createLink = async () => {
    await prisma.link.create({
      data: {
        domain: 'l.advents.io',
        slug: 'teste2',
        iosUrl: 'https://apps.apple.com/br/app/id1598991618?platform=iphone',
        androidUrl: 'https://play.google.com/store/apps/details?id=com.quebarbada.quebarbada',
        fallbackUrl: 'https://favorito.digital',
      },
    })
  }

  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-5'>
      Advents
      <Button onClick={createLink}>Click me</Button>
    </main>
  )
}
