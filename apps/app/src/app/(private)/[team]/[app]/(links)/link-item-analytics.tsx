import { routes } from '@advents/common'
import { DownloadIcon, MousePointerClickIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

import { Badge } from '@/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props {
  clicks: number
  installs: number
}

export const LinkItemAnalytics = ({ clicks, installs }: Props) => {
  const { team, app } = useParams<{ team: string; app: string }>()

  return (
    <div className='hidden gap-2 truncate sm:flex'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={routes.ANALYTICS.path(team, app)} className='flex truncate'>
            <Badge variant='secondary' className='truncate py-1 font-normal'>
              <MousePointerClickIcon className='mr-2 size-4' />
              <span className='truncate'>
                {clicks.toLocaleString('en-US').replace(',', '.')} cliques
              </span>
            </Badge>
          </Link>
        </TooltipTrigger>

        <TooltipContent>
          <b>{clicks.toLocaleString('en-US').replace(',', '.')}</b> cliques
          <br />
          <span className='text-xs text-muted-foreground'>
            Cliques totais desde a criação do link
          </span>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link href={routes.ANALYTICS.path(team, app)} className='flex truncate'>
            <Badge variant='secondary' className='truncate py-1 font-normal'>
              <DownloadIcon className='mr-2 size-4' />
              <span className='truncate'>
                {installs.toLocaleString('en-US').replace(',', '.')} instalações
              </span>
            </Badge>
          </Link>
        </TooltipTrigger>

        <TooltipContent>
          <b>{installs.toLocaleString('en-US').replace(',', '.')}</b> instalações
          <br />
          <span className='text-xs text-muted-foreground'>
            Instalações totais desde a criação do link
          </span>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
