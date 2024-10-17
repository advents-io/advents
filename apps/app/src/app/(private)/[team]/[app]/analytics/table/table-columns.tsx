'use client'

import { GetLinkAnalyticsOutput } from '@advents/actions'
import { ColumnDef } from '@tanstack/react-table'

import { formatShortLink } from '@/utils/link-formatter'

import { TableColumnHeader } from './table-column-header'
import { TableRowActions } from './table-row-actions'
import { TableRowCell } from './table-row-cell'

export const tableColumns: ColumnDef<GetLinkAnalyticsOutput>[] = [
  {
    accessorKey: 'slug',
    header: ({ column }) => <TableColumnHeader column={column} title='Link' border />,
    cell: ({ row }) => (
      <TableRowCell border>{formatShortLink('adv.sh', row.getValue('slug'))}</TableRowCell> // TODO: change adv.sh to dynamically get domain
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
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'installs',
    header: ({ column }) => <TableColumnHeader column={column} title='Instalações' />,
    cell: ({ row }) => <TableRowCell>{row.getValue('installs')}</TableRowCell>,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: () => (
      <TableRowCell className='justify-end'>
        <TableRowActions />
      </TableRowCell>
    ),
  },
]
