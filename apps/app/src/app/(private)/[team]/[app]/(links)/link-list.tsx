import { prisma } from '@advents/db'
import { Link } from 'lucide-react'

import { Button } from '@/ui/button'

import { CreateLinkDialog } from './create-link-dialog'
import { LinkItem } from './link-item'
import { LinksPagination } from './links-pagination'

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
        <div className='mx-auto'>
          <div className='flex h-72 max-w-72 flex-col justify-center'>
            <div className='w-fit rounded-lg border bg-gray-50 p-2 shadow-md'>
              <Link className='h-8 w-8' />
            </div>

            <span className='mt-6 text-xl font-semibold'>Links</span>
            <span className='mt-4 text-sm text-muted-foreground'>
              Crie links para utilizar em suas campanhas de instalação do seu app.
              <br />
              <br />
              Com o link também será possível criar QR Codes para suas campanhas.
            </span>

            <CreateLinkDialog className='mt-6'>
              <Button size='sm'>Criar novo link</Button>
            </CreateLinkDialog>
          </div>
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
