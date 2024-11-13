import { prisma } from '@advents/db'
import { LinkIcon } from 'lucide-react'

import {
  EmptyScreen,
  EmptyScreenButton,
  EmptyScreenDescription,
  EmptyScreenIcon,
  EmptyScreenTitle,
} from '@/components/empty-screen'
import { Button } from '@/ui/button'

import { CreateLinkButton } from './create-link-button'
import { LinkItem } from './link-item'
import { LinksPagination } from './links-pagination'

interface Props {
  page: number
  appSlug: string
  teamSlug: string
}

export const LinkList = async ({ page, appSlug, teamSlug }: Props) => {
  const pageSize = 30

  const [links, totalLinks] = await prisma.$transaction([
    prisma.link.findMany({
      where: {
        app: {
          slug: appSlug,
          team: {
            slug: teamSlug,
          },
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
          team: {
            slug: teamSlug,
          },
        },
      },
    }),
  ])

  return (
    <>
      {links.length === 0 && (
        <EmptyScreen>
          <EmptyScreenIcon>
            <LinkIcon />
          </EmptyScreenIcon>

          <EmptyScreenTitle>Links</EmptyScreenTitle>

          <EmptyScreenDescription>
            Crie links para utilizar em suas campanhas de instalação do seu app.
            <br />
            <br />
            Com o link também será possível criar QR Codes para suas campanhas.
          </EmptyScreenDescription>

          <EmptyScreenButton>
            <CreateLinkButton>
              <Button size='sm'>Criar novo link</Button>
            </CreateLinkButton>
          </EmptyScreenButton>
        </EmptyScreen>
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
