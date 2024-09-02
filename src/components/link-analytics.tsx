import { Download, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Badge } from '@/ui/badge'
import { routes } from '@/utils/routes'

interface Props {
  clicks: number
  installs: number
}

export const LinkAnalytics = ({ clicks, installs }: Props) => {
  const { team, app } = useParams<{ team: string; app: string }>()

  return (
    <>
      <Link href={routes.ANALYTICS.path(team, app)} className='hidden sm:flex'>
        <Badge variant='secondary' className='py-1 font-normal'>
          <MousePointerClick className='mr-2 size-4' />
          {clicks} clicks
        </Badge>
      </Link>

      <Link href={routes.ANALYTICS.path(team, app)} className='hidden sm:flex'>
        <Badge variant='secondary' className='py-1 font-normal'>
          <Download className='mr-2 size-4' />
          {installs} instalações
        </Badge>
      </Link>
    </>
  )
}
