import { Metadata } from 'next'

import { CreateLinkDialog } from '@/components/create-link-dialog'
import { LinkItem } from '@/components/link-item'
import { LinksPagination } from '@/components/links-pagination'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Links | Advents',
}

export default async function Home({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams.page) || 1
  const pageSize = 30

  const [links, totalLinks] = await prisma.$transaction([
    prisma.link.findMany({
      select: {
        id: true,
        title: true,
        domain: true,
        slug: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.link.count(),
  ])

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

      <LinksPagination page={page} pageSize={pageSize} total={totalLinks} />
    </main>
  )
}
