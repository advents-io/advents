'use client'

import { GetLinkAnalyticsOutput } from '@advents/actions'
import { ColumnDef } from '@tanstack/react-table'

import { formatShortLink } from '@/utils/link-formatter'

import { TableColumnHeader } from './table-column-header'
import { TableRowActions } from './table-row-actions'

export const tableColumns: ColumnDef<GetLinkAnalyticsOutput>[] = [
  {
    accessorKey: 'slug',
    header: ({ column }) => <TableColumnHeader column={column} title='Link' />,
    cell: ({ row }) => (
      <div className='w-[80px]'>
        {formatShortLink(row.getValue('domain'), row.getValue('slug'))}
      </div>
    ),
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <TableColumnHeader column={column} title='Título' />,
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-[500px] truncate font-medium'>{row.getValue('title')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'clicks',
    header: ({ column }) => <TableColumnHeader column={column} title='Clicks' />,
    cell: ({ row }) => {
      return (
        <div className='flex w-[100px] items-center'>
          <span>{row.getValue('clicks')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'installs',
    header: ({ column }) => <TableColumnHeader column={column} title='Instalações' />,
    cell: ({ row }) => {
      return (
        <div className='flex items-center'>
          <span>{row.getValue('installs')}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: 'actions',
    cell: () => (
      <div className='w-10'>
        <TableRowActions />
      </div>
    ),
  },
]
