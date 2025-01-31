'use client'

import { dayjs } from '@advents/common'
import { Link as LinkDb } from '@advents/db'
import { CheckIcon, CopyIcon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { IconButton } from '@/components/icon-button'
import { LinkItemMoreOptionsButton } from '@/components/link-item-more-options-button'
import { Card, CardContent } from '@/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

import { LinkItemAnalytics } from './link-item-analytics'

interface Props {
  link: Pick<
    LinkDb,
    'id' | 'title' | 'domain' | 'slug' | 'clickCount' | 'installCount' | 'createdAt'
  >
  qrCodeLogoUrl?: string
}

export const LinkItem = ({ link, qrCodeLogoUrl }: Props) => {
  const shortLink = `https://${link.domain}/${link.slug}`

  const copyToClipboard = () => {
    // A faster way to copy localhost links
    const content =
      process.env.NEXT_PUBLIC_VERCEL === '1'
        ? shortLink
        : `http://${link.domain}.localhost:3000/${link.slug}`

    navigator.clipboard.writeText(content)

    toast('Link copiado.')
  }

  return (
    <Card>
      <CardContent className='px-6 py-4'>
        <div className='flex min-h-18 gap-4'>
          <div className='flex flex-col justify-center gap-2 truncate'>
            {link.title && (
              <div className='flex min-h-8 items-center'>
                <span className='text max-w-md truncate font-medium'>{link.title}</span>
              </div>
            )}

            <div className='flex min-h-8 items-center gap-2'>
              <Link
                href={shortLink}
                className='truncate font-mono text-sm text-muted-foreground'
                target='_blank'
              >
                {link.domain}/<span className='font-semibold text-foreground'>{link.slug}</span>
              </Link>

              <IconButton
                tooltip='Copiar link'
                onClick={copyToClipboard}
                className='ml-1'
                postClickIcon={<CheckIcon />}
              >
                <CopyIcon />
              </IconButton>
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

            <LinkItemMoreOptionsButton
              id={link.id}
              domain={link.domain}
              slug={link.slug}
              qrCodeLogoUrl={qrCodeLogoUrl}
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
