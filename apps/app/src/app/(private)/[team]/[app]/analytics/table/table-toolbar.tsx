'use client'

import { Table } from '@tanstack/react-table'
import { X } from 'lucide-react'
import { ChangeEvent } from 'react'

import { Button } from '@/ui/button'
import { Input } from '@/ui/input'

import { TableViewOptions } from './table-view-options'

interface Props<TData> {
  table: Table<TData>
}

export const TableToolbar = <TData,>({ table }: Props<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0
  const filterValue = (table.getColumn('title')?.getFilterValue() as string) ?? ''

  // TODO: implement filter in title and slug columns
  const applyFilter = (event: ChangeEvent<HTMLInputElement>) => {
    table.getColumn('title')?.setFilterValue(event.target.value)
  }

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filtrar por título...'
          value={filterValue}
          onChange={applyFilter}
          className='w-[150px] lg:w-[250px]'
        />

        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()}>
            Limpar
            <X className='ml-2 size-4' />
          </Button>
        )}
      </div>

      <TableViewOptions table={table} />
    </div>
  )
}
