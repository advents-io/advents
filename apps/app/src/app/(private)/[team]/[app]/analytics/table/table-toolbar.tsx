'use client'

import { Table } from '@tanstack/react-table'
import { XIcon } from 'lucide-react'

import { Button } from '@/ui/button'
import { Input } from '@/ui/input'

import { TableViewOptions } from './table-view-options'

interface Props<TData> {
  table: Table<TData>
}

export const TableToolbar = <TData,>({ table }: Props<TData>) => {
  const handleSetFilter = (value: string) => {
    table.setGlobalFilter(value)
  }

  const search = table.getState().globalFilter as string

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          placeholder='Filtrar por título...'
          value={search}
          onChange={event => handleSetFilter(event.target.value)}
          className='w-[150px] lg:w-[250px]'
        />

        {!!search && (
          <Button variant='outline' className='border-dashed' onClick={() => handleSetFilter('')}>
            <XIcon />
            Limpar
          </Button>
        )}
      </div>

      <TableViewOptions table={table} />
    </div>
  )
}
