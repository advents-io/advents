import { cn } from '@/lib/tailwind'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  border?: boolean
}

export const TableRowCell = ({ children, className, border = false }: Props) => {
  return (
    <div className={cn('flex h-10 items-center px-4', className, border && '-mr-[0.5px] border-r')}>
      {typeof children === 'object' ? children : <span className='truncate'>{children}</span>}
    </div>
  )
}
