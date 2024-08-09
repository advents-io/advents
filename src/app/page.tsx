import { Metadata } from 'next'

import { CreateLinkDialog } from '@/components/create-link-dialog'
import { LinkItem } from '@/components/link-item'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Links | Advents',
}

export default async function Home() {
  const links = await prisma.link.findMany({
    select: {
      id: true,
      title: true,
      domain: true,
      slug: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <main className='flex flex-1 flex-col p-8 md:p-14'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Links</h1>

        <CreateLinkDialog />
      </div>

      <div className='space-y-4'>
        {links.map((link, index) => (
          <LinkItem key={index} link={link} />
        ))}
      </div>

      <p className='mt-4 text-sm text-muted-foreground'>
        Exibindo 1 - {links.length} de {links.length} links
      </p>
    </main>
  )
}
