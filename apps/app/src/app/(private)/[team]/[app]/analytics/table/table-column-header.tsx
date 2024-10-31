import { Column } from '@tanstack/react-table'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronsUpDownIcon,
  CircleHelpIcon,
  EyeOffIcon,
} from 'lucide-react'

import { cn } from '@/lib/tailwind'
import { Button } from '@/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip'

interface Props<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  border?: boolean
  tooltip?: React.ReactNode
}

export const TableColumnHeader = <TData, TValue>({
  column,
  border = false,
  tooltip,
  className,
}: Props<TData, TValue>) => {
  // @ts-expect-error meta has title property
  const title = column.columnDef.meta?.title

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className={cn(
            'flex h-full items-center pl-4',
            border && '-mr-[0.5px] border-r',
            className,
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                size='sm'
                className='-ml-3 h-8 text-foreground data-[state=open]:bg-accent'
              >
                <span>{title}</span>

                {tooltip && <CircleHelpIcon className='ml-2 size-3 text-muted-foreground' />}

                {column.getIsSorted() === 'desc' ? (
                  <ArrowDownIcon className='ml-2 size-4' />
                ) : column.getIsSorted() === 'asc' ? (
                  <ArrowUpIcon className='ml-2 size-4' />
                ) : (
                  <ChevronsUpDownIcon className='ml-2 size-3 text-muted-foreground' />
                )}
              </Button>
            </TooltipTrigger>

            {tooltip && <TooltipContent className='font-normal'>{tooltip}</TooltipContent>}
          </Tooltip>
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
          <EyeOffIcon className='mr-2 size-3.5' />
          Ocultar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
