'use client'

import { dayjs } from '@advents/common'
import { Link as LinkDb } from '@advents/db'
import { CopyIcon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { LinkItemDropdown } from '@/components/link-item-dropdown'
import { cn } from '@/lib/tailwind'
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
    navigator.clipboard.writeText(httpShortLink)

    toast('Link copiado')
  }

  return (
    <Card>
      <CardContent className='flex px-6 py-4 text-sm'>
        <div className='flex min-h-16 items-center gap-4 truncate'>
          <div className='flex flex-col gap-2'>
            {link.title && <span className='truncate text-base font-medium'>{link.title}</span>}

            <div className='flex items-center gap-2'>
              <Link
                href={httpShortLink}
                className={cn('text-muted-foreground', !link.title && 'text-base')}
                target='_blank'
              >
                {link.domain}/<span className='font-medium text-foreground'>{link.slug}</span>
              </Link>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className='ml-1 h-8 w-8 rounded-full'
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

          <Tooltip>
            <TooltipTrigger asChild>
              <span className='ml-2 hidden text-muted-foreground lg:flex'>
                {formatDate(link.createdAt)}
              </span>
            </TooltipTrigger>

            <TooltipContent>
              {dayjs(link.createdAt).format('DD MMM YY, HH:mm')}
              <br />
              <span className='text-xs text-muted-foreground'>Data de criação</span>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className='flex flex-1 items-center justify-end gap-2'>
          <LinkItemAnalytics clicks={link.clickCount} installs={link.installCount} />

          <LinkItemDropdown
            id={link.id}
            domain={link.domain}
            slug={link.slug}
            qrcodeLogoUrl={qrcodeLogoUrl}
          />
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
