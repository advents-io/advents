'use client'

import { dayjs } from '@advents/common'
import { Link } from '@advents/db'
import { ArrowRightIcon } from 'lucide-react'

import { LinkAnalytics } from '@/components/link-analytics'
import { LinkItemCopy } from '@/components/link-item-copy'
import { LinkItemDropdown } from '@/components/link-item-dropdown'
import { Card, CardContent } from '@/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props {
  link: Pick<Link, 'id' | 'title' | 'domain' | 'slug' | 'clickCount' | 'installCount' | 'createdAt'>
  qrcodeLogoUrl?: string
}

export const LinkItem = ({ link, qrcodeLogoUrl }: Props) => {
  return (
    <Card>
      <CardContent className='flex px-6 py-4 text-sm'>
        <div className='flex flex-1 items-center gap-2'>
          <span className='text-md hidden text-muted-foreground sm:flex'>{link.title}</span>

          {link.title && <ArrowRightIcon className='hidden size-4 text-muted-foreground sm:flex' />}

          <LinkItemCopy domain={link.domain} slug={link.slug} />

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
