'use client'

import { dayjs } from '@advents/common'
import { GetLinksAnalyticsOutput } from '@advents/queries/client'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, CopyIcon } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'
import { formatShortLink } from '@/utils/link-formatter'

import { TableColumnHeader } from './table-column-header'
import { TableRowCell } from './table-row-cell'

export const tableColumns: ColumnDef<GetLinksAnalyticsOutput[number]>[] = [
  {
    accessorKey: 'slug',
    meta: {
      title: 'Link',
    },
    header: ({ column }) => <TableColumnHeader column={column} border />,
    cell: ({ row }) => {
      const httpShortLink = formatShortLink(row.original.domain, row.original.slug, true)

      return (
        <TableRowCell border>
          <Link href={httpShortLink} className='truncate text-muted-foreground' target='_blank'>
            {row.original.domain}/
            <span className='font-semibold text-foreground'>{row.original.slug}</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className='ml-2 size-8 rounded-full text-muted-foreground'
                onClick={() => {
                  navigator.clipboard.writeText(httpShortLink)
                  toast('Link copiado')
                }}
                variant='ghost'
                size='icon'
              >
                <CopyIcon className='size-4' />
              </Button>
            </TooltipTrigger>

            <TooltipContent>Copiar link</TooltipContent>
          </Tooltip>
        </TableRowCell>
      )
    },
  },
  {
    accessorKey: 'title',
    meta: {
      title: 'Título',
    },
    header: ({ column }) => <TableColumnHeader column={column} border />,
    cell: ({ row }) => <TableRowCell border>{row.original.title}</TableRowCell>,
  },
  {
    accessorKey: 'clicks',
    meta: {
      title: 'Cliques',
    },
    header: ({ column }) => <TableColumnHeader column={column} border />,
    cell: ({ row }) => (
      <TableRowCell border>
        {row.original.clicks.toLocaleString('en-US').replace(',', '.')}
      </TableRowCell>
    ),
  },
  {
    accessorKey: 'costPerClick',
    meta: {
      title: 'CPC',
    },
    header: ({ column }) => <TableColumnHeader column={column} border tooltip='Custo por clique' />,
    cell: ({ row }) => (
      <TableRowCell border>
        {!!row.original.campaignCost && row.original.campaignCost > 0 && row.original.clicks > 0
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(row.original.campaignCost / row.original.clicks)
          : ''}
      </TableRowCell>
    ),
    sortingFn: (rowA, rowB) => {
      const rowACpc =
        !!rowA.original.campaignCost && rowA.original.campaignCost > 0 && rowA.original.clicks > 0
          ? rowA.original.campaignCost! / rowA.original.clicks
          : -1

      const rowBCpc =
        !!rowB.original.campaignCost && rowB.original.campaignCost > 0 && rowB.original.clicks > 0
          ? rowB.original.campaignCost! / rowB.original.clicks
          : -1

      return rowACpc - rowBCpc
    },
  },
  {
    accessorKey: 'installs',
    meta: {
      title: 'Instalações',
    },
    header: ({ column }) => <TableColumnHeader column={column} border />,
    cell: ({ row }) => (
      <TableRowCell border>
        {row.original.installs.toLocaleString('en-US').replace(',', '.')}
      </TableRowCell>
    ),
  },
  {
    accessorKey: 'costPerInstall',
    meta: {
      title: 'CPI',
    },
    header: ({ column }) => (
      <TableColumnHeader column={column} border tooltip='Custo por instalação' />
    ),
    cell: ({ row }) => (
      <TableRowCell border>
        {!!row.original.campaignCost && row.original.campaignCost > 0 && row.original.installs > 0
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(row.original.campaignCost / row.original.installs)
          : ''}
      </TableRowCell>
    ),
    sortingFn: (rowA, rowB) => {
      const rowACpi =
        !!rowA.original.campaignCost && rowA.original.campaignCost > 0 && rowA.original.installs > 0
          ? rowA.original.campaignCost! / rowA.original.installs
          : -1

      const rowBCpi =
        !!rowB.original.campaignCost && rowB.original.campaignCost > 0 && rowB.original.installs > 0
          ? rowB.original.campaignCost! / rowB.original.installs
          : -1

      return rowACpi - rowBCpi
    },
  },
  {
    accessorKey: 'campaignCost',
    meta: {
      title: 'Custo',
    },
    header: ({ column }) => <TableColumnHeader column={column} border />,
    cell: ({ row }) => (
      <TableRowCell border>
        {!!row.original.campaignCost && row.original.campaignCost > 0
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(row.original.campaignCost)
          : ''}
      </TableRowCell>
    ),
  },
  {
    accessorKey: 'revenue',
    meta: {
      title: 'Receita',
    },
    header: ({ column }) => <TableColumnHeader column={column} border />,
    cell: ({ row }) => (
      <TableRowCell border>
        {row.original.revenue > 0
          ? new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(row.original.revenue)
          : ''}
      </TableRowCell>
    ),
  },
  {
    accessorKey: 'roas',
    meta: {
      title: 'ROAS',
    },
    header: ({ column }) => (
      <TableColumnHeader
        column={column}
        border
        tooltip='Return on Ad Spend (Retorno do investimento na campanha)'
      />
    ),
    cell: ({ row }) => {
      const { campaignCost, revenue } = row.original

      const roas =
        !!campaignCost && campaignCost > 0 ? ((revenue - campaignCost) / campaignCost) * 100 : null

      const formatedRoasNumber = !roas
        ? null
        : Number.isInteger(roas)
          ? roas.toString()
          : roas.toFixed(2).replace('.', ',')

      const roasIsPositive = !!roas && roas > 0
      const roasIsNegative = !!roas && roas < 0

      return (
        <TableRowCell border>
          {formatedRoasNumber ? (
            <span
              className={cn(
                'flex items-center gap-1',
                roasIsPositive && 'font-medium text-green-600',
                roasIsNegative && 'font-medium text-red-500',
              )}
            >
              {roasIsPositive && (
                <ArrowUpIcon className='size-3 text-green-600' strokeWidth={2.5} />
              )}
              {roasIsNegative && (
                <ArrowDownIcon className='size-3 text-red-500' strokeWidth={2.5} />
              )}
              {`${formatedRoasNumber}%`}
            </span>
          ) : (
            ''
          )}
        </TableRowCell>
      )
    },
    sortingFn: (rowA, rowB) => {
      const { campaignCost: rowACampaignCost, revenue: rowARevenue } = rowA.original
      const { campaignCost: rowBCampaignCost, revenue: rowBRevenue } = rowB.original

      const roasA =
        !!rowACampaignCost && rowACampaignCost > 0
          ? ((rowARevenue - rowACampaignCost) / rowACampaignCost) * 100
          : 0

      const roasB =
        !!rowBCampaignCost && rowBCampaignCost > 0
          ? ((rowBRevenue - rowBCampaignCost) / rowBCampaignCost) * 100
          : 0

      return roasA - roasB
    },
  },
  {
    accessorKey: 'createdAt',
    meta: {
      title: 'Criado em',
    },
    header: ({ column }) => <TableColumnHeader column={column} />,
    cell: ({ row }) => (
      <TableRowCell>{dayjs(row.original.createdAt).format('DD MMM YY, HH:mm')}</TableRowCell>
    ),
  },
]
