import { Copy } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'
import { formatShortLink } from '@/utils/link-formatter'

interface Props {
  domain: string
  slug: string
}

export const LinkItemCopy = ({ domain, slug }: Props) => {
  const shortLink = formatShortLink(domain, slug)
  const httpShortLink = formatShortLink(domain, slug, true)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(httpShortLink)

    toast('Link copiado')
  }

  return (
    <>
      <Link
        href={httpShortLink}
        className='max-w-44 truncate font-semibold sm:max-w-none'
        target='_blank'
      >
        {shortLink}
      </Link>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className='ml-1 h-8 w-8 rounded-full'
            onClick={copyToClipboard}
            variant='ghost'
            size='icon'
          >
            <Copy className='size-4' />
          </Button>
        </TooltipTrigger>

        <TooltipContent>Copiar link</TooltipContent>
      </Tooltip>
    </>
  )
}
