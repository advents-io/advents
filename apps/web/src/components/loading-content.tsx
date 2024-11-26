import { Loader2Icon } from 'lucide-react'

import { cn } from '@/lib/tailwind'

interface Props {
  children: React.ReactNode
  loading: boolean
}

export const LoadingContent = ({ children, loading }: Props) => {
  return (
    <div className={cn('flex items-center gap-2 px-3', loading && 'px-0')}>
      {loading && <Loader2Icon className='size-4 animate-spin' />}
      {children}
    </div>
  )
}
