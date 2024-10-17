import { Column } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDown, EyeOff } from 'lucide-react'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'

interface Props<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  border?: boolean
}

export const TableColumnHeader = <TData, TValue>({
  column,
  title,
  border = false,
  className,
}: Props<TData, TValue>) => {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'flex h-full items-center px-4',
            border && '-mr-[0.5px] border-r',
            className,
          )}
        >
          <Button
            variant='ghost'
            size='sm'
            className='-ml-3 h-8 text-foreground data-[state=open]:bg-accent'
          >
            <span>{title}</span>

            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className='ml-2 size-4' />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className='ml-2 size-4' />
            ) : (
              <ChevronsUpDown className='ml-2 size-4' />
            )}
          </Button>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start'>
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <ArrowUpIcon className='mr-2 size-3.5' />
          Asc
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <ArrowDownIcon className='mr-2 size-3.5' />
          Desc
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
          <EyeOff className='mr-2 size-3.5' />
          Ocultar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
