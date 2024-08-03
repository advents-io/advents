'use client'

import { Link } from '@prisma/client'
import { Copy, EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import NextLink from 'next/link'
import { toast } from 'sonner'

import { EditLinkDialog } from '@/components/edit-link-dialog'
import { dayjs } from '@/lib/dayjs'
import { Button } from '@/ui/button'
import { Card, CardContent } from '@/ui/card'
import { DialogTrigger } from '@/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props {
  link: Pick<Link, 'id' | 'domain' | 'slug' | 'createdAt'>
}

export const LinkItem = ({ link }: Props) => {
  const shortLink = `${link.domain}/${link.slug}`
  const httpShortLink = `https://${shortLink}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(httpShortLink)

    toast('Link copiado')
  }

  return (
    <Card>
      <CardContent className='flex p-6 text-sm'>
        <div className='flex flex-1 items-center gap-2'>
          <NextLink href={httpShortLink} className='font-semibold' target='_blank'>
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
                <Copy className='h-4 w-4' />
              </Button>
            </TooltipTrigger>

            <TooltipContent>Copiar link</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <span className='ml-2 text-muted-foreground'>{formatDate(link.createdAt)}</span>
            </TooltipTrigger>

            <TooltipContent>{dayjs(link.createdAt).format('DD MMM YY, HH:mm')}</TooltipContent>
          </Tooltip>
        </div>

        <div className='flex items-center'>
          <EditLinkDialog linkId={link.id}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='icon'>
                  <EllipsisVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <Pencil className='mr-2 h-4 w-4' />
                    Editar
                  </DropdownMenuItem>
                </DialogTrigger>

                <DropdownMenuItem>
                  <Trash2 className='mr-2 h-4 w-4 text-destructive' />
                  <span className='text-destructive'>Deletar</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </EditLinkDialog>
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
