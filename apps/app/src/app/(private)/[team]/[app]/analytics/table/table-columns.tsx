'use client'

import { GetLinksAnalyticsOutput } from '@advents/queries'
import { ColumnDef } from '@tanstack/react-table'

import { formatShortLink } from '@/utils/link-formatter'

import { TableColumnHeader } from './table-column-header'
import { TableRowCell } from './table-row-cell'

export const tableColumns: ColumnDef<GetLinksAnalyticsOutput[number]>[] = [
  {
    accessorKey: 'slug',
    header: ({ column }) => <TableColumnHeader column={column} title='Link' border />,
    cell: ({ row }) => (
      <TableRowCell border>
        {formatShortLink(row.original.domain, row.getValue('slug'))}
      </TableRowCell>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <TableColumnHeader column={column} title='Título' border />,
    cell: ({ row }) => <TableRowCell border>{row.getValue('title')}</TableRowCell>,
  },
  {
    accessorKey: 'clicks',
    header: ({ column }) => <TableColumnHeader column={column} title='Cliques' border />,
    cell: ({ row }) => <TableRowCell border>{row.getValue('clicks')}</TableRowCell>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: 'installs',
    header: ({ column }) => <TableColumnHeader column={column} title='Instalações' />,
    cell: ({ row }) => <TableRowCell>{row.getValue('installs')}</TableRowCell>,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },
]
