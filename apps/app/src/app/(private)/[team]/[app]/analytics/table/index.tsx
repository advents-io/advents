'use client'

import { dayjs } from '@advents/common'
import { useQuery } from '@tanstack/react-query'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { HTMLAttributes, useState } from 'react'

import { LinkItemMoreOptionsButton } from '@/components/link-item-more-options-button'
import {
  AnalyticsTableLinksProvider,
  useAnalyticsTableLinks,
} from '@/contexts/analytics-table-links-context'
import { getAppQrCodeLogoUrl } from '@/lib/queries/get-app-qrcode-logo-url'
import { getLinksAnalytics } from '@/lib/queries/get-links-analytics'
import { cn } from '@/lib/tailwind'
import { Skeleton } from '@/ui/skeleton'
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
import { TableRowCell } from './table-row-cell'
import { TableToolbar } from './table-toolbar'

interface Props extends HTMLAttributes<HTMLDivElement> {
  appSlug: string
  teamSlug: string
}

export const Table = (props: Props) => (
  <AnalyticsTableLinksProvider>
    <TableComp {...props} />
  </AnalyticsTableLinksProvider>
)

const TableComp = ({ appSlug, teamSlug, className }: Props) => {
  const [search, setSearch] = useState('')

  const { links, setLinks } = useAnalyticsTableLinks()

  const [{ startDate, endDate }] = useStartEndDate()

  const { isFetching } = useQuery({
    queryKey: ['links-analytics', appSlug, teamSlug, startDate, endDate, setLinks],
    queryFn: async () => {
      const links = await getLinksAnalytics({
        appSlug,
        teamSlug,
        startDate: dayjs(startDate).toDate(),
        endDate: dayjs(endDate).toDate(),
      })

      if (setLinks) {
        setLinks(links)
      }

      return links
    },
    refetchOnWindowFocus: false,
  })

  const { data: qrCodeLogoUrl } = useQuery({
    queryKey: ['app-qr-code-logo-url', appSlug, teamSlug],
    queryFn: () => getAppQrCodeLogoUrl({ appSlug, teamSlug }),
  })

  const table = useReactTable({
    data: links,
    columns: tableColumns,
    state: {
      globalFilter: search,
    },
    onGlobalFilterChange: setSearch,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: row => {
      const valuesToFilter: string[] = [row.original.title || '', row.original.slug]

      return valuesToFilter.some(valueToFilter =>
        valueToFilter.toLowerCase().startsWith(search.toLowerCase()),
      )
    },
  })

  return (
    <div className={cn('space-y-4', className)}>
      <TableToolbar table={table} />

      <div className='rounded-md border bg-white'>
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

                {/* Actions column header. Without this, the header will have an empty space */}
                <TableHead className='p-0'>{flexRender(<div />, {})}</TableHead>
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isFetching ? (
              <>
                {Array.from({ length: 20 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: tableColumns.length }).map((_, index) => (
                      <TableCell key={index} className='p-0'>
                        {flexRender(
                          <TableRowCell border={index !== tableColumns.length - 1}>
                            <Skeleton className='h-[24px] w-full' />
                          </TableRowCell>,
                          {},
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id} className='p-0'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}

                  {/**
                   * Actions column. We can't pass it on `table-columns.tsx` because we have to pass the qrCodeUrl,
                   * which is fetched on the server, and this was causing an error on rendering the table
                   */}
                  <TableCell className='p-0'>
                    {flexRender(
                      <TableRowCell className='justify-end'>
                        <LinkItemMoreOptionsButton
                          id={row.original.id}
                          domain={row.original.domain}
                          slug={row.original.slug}
                          qrcodeLogoUrl={qrCodeLogoUrl?.url || undefined}
                          className='size-8'
                        />
                      </TableRowCell>,
                      {},
                    )}
                  </TableCell>
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
