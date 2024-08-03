import { Link } from '@prisma/client'
import NextLink from 'next/link'

import { dayjs } from '@/lib/dayjs'
import { Card, CardContent } from '@/ui/card'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props {
  link: Pick<Link, 'domain' | 'slug' | 'createdAt'>
}

export const LinkItem = ({ link }: Props) => {
  const shortLink = `${link.domain}/${link.slug}`
  const httpShortLink = `https://${shortLink}`

  return (
    <Card>
      <CardContent className='flex gap-4 p-6 text-sm'>
        <NextLink href={httpShortLink} className='font-semibold' target='_blank'>
          {shortLink}
        </NextLink>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className='text-muted-foreground'>{formatDate(link.createdAt)}</span>
          </TooltipTrigger>
          <TooltipContent>{dayjs(link.createdAt).format('DD MMM YY, HH:mm')}</TooltipContent>
        </Tooltip>
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
