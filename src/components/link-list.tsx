import Image from 'next/image'

import Empty from '@/assets/illustrations/empty.svg'
import { CreateLinkDialog } from '@/components/create-link-dialog'
import { LinkItem } from '@/components/link-item'
import { LinksPagination } from '@/components/links-pagination'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'

interface Props {
  page: number
  appSlug: string
}

export const LinkList = async ({ page, appSlug }: Props) => {
  const pageSize = 30

  const [links, totalLinks] = await prisma.$transaction([
    prisma.link.findMany({
      where: {
        app: {
          slug: appSlug,
        },
      },
      select: {
        id: true,
        title: true,
        domain: true,
        slug: true,
        clickCount: true,
        installCount: true,
        createdAt: true,
        app: {
          select: {
            qrcodeLogoUrl: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.link.count({
      where: {
        app: {
          slug: appSlug,
        },
      },
    }),
  ])

  return (
    <>
      {links.length === 0 && (
        <div className='flex justify-center'>
          <Card className='w-full max-w-xl'>
            <CardHeader>
              <CardTitle>Nenhum link encontrado</CardTitle>
            </CardHeader>

            <CardContent className='mt-10 flex flex-col items-center gap-10'>
              <Image src={Empty} width={200} height={200} alt='Nenhum app encontrado' />

              <CreateLinkDialog />
            </CardContent>
          </Card>
        </div>
      )}

      <div className='space-y-4'>
        {links.map((link, index) => (
          <LinkItem key={index} link={link} qrcodeLogoUrl={link.app.qrcodeLogoUrl ?? undefined} />
        ))}
      </div>

      {links.length > 0 && <LinksPagination page={page} pageSize={pageSize} total={totalLinks} />}
    </>
  )
}
