'use client'

import { dayjs } from '@advents/common'
import { GetLinksAnalyticsOutput } from '@advents/queries'
import { ColumnDef } from '@tanstack/react-table'

import { LinkItemCopy } from '@/components/link-item-copy'

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
