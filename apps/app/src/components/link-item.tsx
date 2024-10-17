'use client'

import { dayjs } from '@advents/common'
import { Link } from '@advents/db'
import { ArrowRightIcon, Copy } from 'lucide-react'
import NextLink from 'next/link'
import { toast } from 'sonner'

import { LinkAnalytics } from '@/components/link-analytics'
import { LinkItemDropdown } from '@/components/link-item-dropdown'
import { Button } from '@/ui/button'
import { Card, CardContent } from '@/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'
import { formatShortLink } from '@/utils/link-formatter'

interface Props {
  link: Pick<Link, 'id' | 'title' | 'domain' | 'slug' | 'clickCount' | 'installCount' | 'createdAt'>
  qrcodeLogoUrl?: string
}

export const LinkItem = ({ link, qrcodeLogoUrl }: Props) => {
  const shortLink = formatShortLink(link.domain, link.slug)
  const httpShortLink = formatShortLink(link.domain, link.slug, true)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(httpShortLink)

    toast('Link copiado')
  }

  return (
    <Card>
      <CardContent className='flex px-2 py-4 text-sm'>
        <div className='flex flex-1 items-center gap-2'>
          <span className='text-md hidden text-muted-foreground sm:flex'>{link.title}</span>

          {link.title && <ArrowRightIcon className='hidden size-4 text-muted-foreground sm:flex' />}

          <NextLink
            href={httpShortLink}
            className='max-w-44 truncate font-semibold sm:max-w-none'
            target='_blank'
          >
            {shortLink}
          </NextLink>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className='h-8 w-8 rounded-full'
                onClick={copyToClipboard}
                variant='ghost'
                size='icon'
              >
                <Copy className='size-4' />
              </Button>
            </TooltipTrigger>

            <TooltipContent>Copiar link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className='ml-2 hidden text-muted-foreground sm:flex'>
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

        <div className='flex items-center gap-2'>
          <LinkAnalytics clicks={link.clickCount} installs={link.installCount} />

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
