import { LinkItem } from '@/components/link-item'
import { LinksPagination } from '@/components/links-pagination'
import { prisma } from '@/lib/prisma'

interface Props {
  page: number
}

export const LinkList = async ({ page }: Props) => {
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
    <>
      <div className='space-y-4'>
        {links.map((link, index) => (
          <LinkItem key={index} link={link} />
        ))}
      </div>

      <LinksPagination page={page} pageSize={pageSize} total={totalLinks} />
    </>
  )
}
