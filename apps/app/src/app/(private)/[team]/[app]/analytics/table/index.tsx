'use client'

import { getLinksAnalyticsAction, useAction } from '@advents/actions'
import { dayjs } from '@advents/common'
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { HTMLAttributes, useEffect, useState } from 'react'

import { cn } from '@/lib/tailwind'
import {
  Table as TableUi,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/ui/table'

import { useStartEndDate } from '../use-start-end-date'
import { tableColumns } from './table-columns'
import { TableToolbar } from './table-toolbar'

interface Props extends HTMLAttributes<HTMLDivElement> {
  appSlug: string
}

export const Table = ({ appSlug, className }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const [{ startDate, endDate }] = useStartEndDate()

  const {
    execute: getLinksAnalytics,
    result: { data: links },
    isExecuting,
    isIdle,
  } = useAction(getLinksAnalyticsAction)

  useEffect(() => {
    getLinksAnalytics({
      appSlug,
      startDate: dayjs(startDate).toDate(),
      endDate: dayjs(endDate).toDate(),
    })
  }, [appSlug, startDate, endDate, getLinksAnalytics])

  const table = useReactTable({
    data: links ?? [],
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className={cn('space-y-4', className)}>
      <TableToolbar table={table} />

      <div className='rounded-md border'>
        <TableUi>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isExecuting || isIdle ? (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className='h-24 text-center'>
                  <div className='flex justify-center'>
                    <Loader2 className='size-6 animate-spin' />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(link => (
                <TableRow key={link.id} data-state={link.getIsSelected() && 'selected'}>
                  {link.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className='h-24 text-center'>
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableUi>
      </div>
    </div>
  )
}
