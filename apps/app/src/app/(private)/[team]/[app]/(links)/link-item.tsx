'use client'

import { dayjs } from '@advents/common'
import { Link as LinkDb } from '@advents/db'
import { LINK_LOCALHOST_DOMAIN } from '@advents/queries/server'
import { CopyIcon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { LinkItemDropdown } from '@/components/link-item-dropdown'
import { Button } from '@/ui/button'
import { Card, CardContent } from '@/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'
import { formatShortLink } from '@/utils/link-formatter'

import { LinkItemAnalytics } from './link-item-analytics'

interface Props {
  link: Pick<
    LinkDb,
    'id' | 'title' | 'domain' | 'slug' | 'clickCount' | 'installCount' | 'createdAt'
  >
  qrcodeLogoUrl?: string
}

export const LinkItem = ({ link, qrcodeLogoUrl }: Props) => {
  const httpShortLink = formatShortLink(link.domain, link.slug, true)

  const copyToClipboard = () => {
    // A faster way to copy localhost links
    const content =
      process.env.VERCEL === '1' ? httpShortLink : `http://${LINK_LOCALHOST_DOMAIN}/${link.slug}`

    navigator.clipboard.writeText(content)

    toast('Link copiado')
  }

  return (
    <Card>
      <CardContent className='px-6 py-4'>
        <div className='flex min-h-16 gap-4'>
          <div className='flex flex-col justify-center gap-2 truncate'>
            {link.title && <span className='max-w-md truncate font-medium'>{link.title}</span>}

            <div className='flex items-center gap-2'>
              <Link
                href={httpShortLink}
                className='truncate font-mono text-sm text-muted-foreground'
                target='_blank'
              >
                {link.domain}/<span className='font-semibold text-foreground'>{link.slug}</span>
              </Link>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className='ml-1 size-8 rounded-full text-muted-foreground'
                    onClick={copyToClipboard}
                    variant='ghost'
                    size='icon'
                  >
                    <CopyIcon className='size-4' />
                  </Button>
                </TooltipTrigger>

                <TooltipContent>Copiar link</TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className='flex flex-1 items-center justify-end gap-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className='mr-2 hidden truncate text-sm text-muted-foreground md:flex'>
                  {formatDate(link.createdAt)}
                </span>
              </TooltipTrigger>

              <TooltipContent>
                {dayjs(link.createdAt).format('DD MMM YY, HH:mm')}
                <br />
                <span className='text-xs text-muted-foreground'>Data de criação</span>
              </TooltipContent>
            </Tooltip>

            <LinkItemAnalytics clicks={link.clickCount} installs={link.installCount} />

            <LinkItemDropdown
              id={link.id}
              domain={link.domain}
              slug={link.slug}
              qrcodeLogoUrl={qrcodeLogoUrl}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const formatDate = (date: Date) => {
  const inputDate = dayjs(date)
  const currentYear = dayjs().year()
  const inputYear = inputDate.year()

  return inputYear === currentYear
    ? inputDate.format('DD MMM')
    : //
      inputDate.format('DD MMM YY')
}
