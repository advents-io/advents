import { routes } from '@advents/common'
import { Download, MousePointerClick } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Badge } from '@/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props {
  clicks: number
  installs: number
}

export const LinkAnalytics = ({ clicks, installs }: Props) => {
  const { team, app } = useParams<{ team: string; app: string }>()

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={routes.ANALYTICS.path(team, app)} className='hidden sm:flex'>
            <Badge variant='secondary' className='py-1 font-normal'>
              <MousePointerClick className='mr-2 size-4' />
              {clicks} clicks
            </Badge>
          </Link>
        </TooltipTrigger>

        <TooltipContent>
          <b>{clicks}</b> clicks
          <br />
          <span className='text-xs text-muted-foreground'>
            Clicks totais desde a criação do link
          </span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={routes.ANALYTICS.path(team, app)} className='hidden sm:flex'>
            <Badge variant='secondary' className='py-1 font-normal'>
              <Download className='mr-2 size-4' />
              {installs} instalações
            </Badge>
          </Link>
        </TooltipTrigger>

        <TooltipContent>
          <b>{installs}</b> instalações
          <br />
          <span className='text-xs text-muted-foreground'>
            Instalações totais desde a criação do link
          </span>
        </TooltipContent>
      </Tooltip>
    </>
  )
}
