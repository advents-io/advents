import { LinkItem } from '@/components/link-item'
import { LinksPagination } from '@/components/links-pagination'
import { prisma } from '@/lib/prisma'

interface Props {
  page: number
  appId: string
}

export const LinkList = async ({ page, appId }: Props) => {
  const pageSize = 30

  const [links, totalLinks] = await prisma.$transaction([
    prisma.link.findMany({
      where: {
        appId,
      },
      select: {
        id: true,
        title: true,
        domain: true,
        slug: true,
        clicks: true,
        installs: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.link.count({
      where: {
        appId,
      },
    }),
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
