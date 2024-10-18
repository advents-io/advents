import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/tailwind'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  loading: boolean
}

export const LoadingSpinner = ({ children, loading, className, ...rest }: Props) => {
  return (
    <div className='relative w-full'>
      <div
        className={cn(
          'flex items-center justify-center gap-2 opacity-100',
          loading && 'opacity-0',
          className,
        )}
        {...rest}
      >
        {children}
      </div>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center'>
          <Loader2 className='size-4 animate-spin' />
        </div>
      )}
    </div>
  )
}
