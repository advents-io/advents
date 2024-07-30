import { Link } from '@prisma/client'
import NextLink from 'next/link'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface Props {
  link: Link
}

export const LinkItem = ({ link }: Props) => {
  const fullLink = `${link.domain}/${link.slug}`
  const fullHttpsLink = `https://${fullLink}`

  return (
    <Card>
      <CardHeader>
        <NextLink href={fullHttpsLink} className='font-semibold' target='_blank'>
          {fullLink}
        </NextLink>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>
          <b>Android:</b> <NextLink href={link.androidUrl}>{link.androidUrl}</NextLink>
        </p>
        <p className='text-sm text-muted-foreground'>
          <b>iOS:</b> <NextLink href={link.iosUrl}>{link.iosUrl}</NextLink>
        </p>
        <p className='text-sm text-muted-foreground'>
          <b>Url Alternativa:</b> <NextLink href={link.fallbackUrl}>{link.fallbackUrl}</NextLink>
        </p>
      </CardContent>
    </Card>
  )
}
