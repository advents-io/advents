'use client'

import { GetLinksAnalyticsOutput } from '@advents/queries'
import { useQuery } from '@tanstack/react-query'
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
import ky from 'ky'
import { Loader2 } from 'lucide-react'
import { HTMLAttributes, useState } from 'react'

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
  teamSlug: string
}

export const Table = ({ appSlug, teamSlug, className }: Props) => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const [{ startDate, endDate }] = useStartEndDate()

  const { data: links, isPending } = useQuery({
    queryKey: ['links-analytics', appSlug, teamSlug, startDate, endDate],
    queryFn: () =>
      ky
        .get<GetLinksAnalyticsOutput>('/api/analytics/links', {
          searchParams: {
            appSlug,
            teamSlug,
            startDate,
            endDate,
          },
        })
        .json(),
  })

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
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} colSpan={header.colSpan} className='p-0'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isPending ? (
              <TableRow>
                <TableCell colSpan={tableColumns.length} className='h-24 text-center'>
                  <div className='flex justify-center'>
                    <Loader2 className='size-6 animate-spin' />
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(link => (
                <TableRow key={link.id}>
                  {link.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className='p-0'>
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
