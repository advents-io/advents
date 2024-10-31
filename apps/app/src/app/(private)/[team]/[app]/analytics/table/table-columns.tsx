'use client'

import { dayjs } from '@advents/common'
import { GetLinksAnalyticsOutput } from '@advents/queries'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowDown, ArrowUp } from 'lucide-react'

import { LinkItemCopy } from '@/components/link-item-copy'
import { cn } from '@/lib/tailwind'

import { TableColumnHeader } from './table-column-header'
import { TableRowCell } from './table-row-cell'

export const tableColumns: ColumnDef<GetLinksAnalyticsOutput[number]>[] = [
  {
    accessorKey: 'slug',
    meta: {
      title: 'Link',
    },
    header: ({ column }) => <TableColumnHeader column={column} border />,
    cell: ({ row }) => (
      <TableRowCell border>
        <LinkItemCopy domain={row.original.domain} slug={row.original.slug} />
      </TableRowCell>
    ),
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
              {roasIsPositive && <ArrowUp className='size-3 text-green-600' strokeWidth={2.5} />}
              {roasIsNegative && <ArrowDown className='size-3 text-red-500' strokeWidth={2.5} />}
              {`${formatedRoasNumber}%`}
            </span>
          ) : (
            ''
          )}
        </TableRowCell>
      )
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
