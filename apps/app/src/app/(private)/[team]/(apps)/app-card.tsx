import { routes } from '@advents/common'
import { DownloadIcon, LinkIcon, MousePointerClickIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/ui/badge'
import { Card, CardHeader } from '@/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props {
  app: {
    links: {
      clickCount: number
      installCount: number
    }[]
    slug: string
    imageUrl: string
    name: string
  }
  teamSlug: string
}

export const AppCard = ({ app, teamSlug }: Props) => {
  const linksCount = app.links.length
  const clicksCount = app.links.reduce((acc, link) => acc + link.clickCount, 0)
  const installCount = app.links.reduce((acc, link) => acc + link.installCount, 0)

  return (
    <Link href={routes.LINKS.path(teamSlug, app.slug)}>
      <Card>
        <CardHeader className='gap-2'>
          <div className='flex items-center gap-4'>
            <div>
              <Image
                src={app.imageUrl}
                alt={app.name}
                width={40}
                height={40}
                className='rounded-full'
              />
            </div>

            <div className='flex flex-col'>
              <span className='text-lg font-semibold'>{app.name}</span>

              <span className='text-sm text-muted-foreground'>{app.slug}</span>
            </div>
          </div>

          <div className='flex gap-1'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant='secondary' className='truncate py-1 font-normal'>
                  <LinkIcon className='mr-2 size-4' />
                  <span className='truncate'>{linksCount}</span>
                </Badge>
              </TooltipTrigger>

              <TooltipContent>
                <b>{linksCount}</b> links
                <br />
                <span className='text-xs text-muted-foreground'>
                  Total de links criados no <b>{app.name}</b>
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant='secondary' className='truncate py-1 font-normal'>
                  <MousePointerClickIcon className='mr-2 size-4' />
                  <span className='truncate'>{clicksCount}</span>
                </Badge>
              </TooltipTrigger>

              <TooltipContent>
                <b>{clicksCount}</b> cliques
                <br />
                <span className='text-xs text-muted-foreground'>
                  Total de cliques nos links do <b>{app.name}</b>
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant='secondary' className='truncate py-1 font-normal'>
                  <DownloadIcon className='mr-2 size-4' />
                  <span className='truncate'>{installCount}</span>
                </Badge>
              </TooltipTrigger>

              <TooltipContent>
                <b>{installCount}</b> instalações
                <br />
                <span className='text-xs text-muted-foreground'>
                  Total de instalações através dos links do <b>{app.name}</b>
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
      </Card>
    </Link>
  )
}
